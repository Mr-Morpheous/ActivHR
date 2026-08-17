-- Gate organization creation behind a code issued by PAC.
--
-- WHY THIS EXISTS
--
-- Signup stays self-serve — anyone can create an account. Creating an
-- organization is now selective: a super_admin issues a single-use code
-- bound to the signer's email (after a sales call, demo, etc.), and
-- `create_organization_for_self` refuses to run without a valid one.
--
-- `create_organization_for_self` is SECURITY DEFINER and reachable directly
-- over PostgREST, so the gate has to live inside it — an app-layer check
-- alone is exactly the kind of thing the 19 Aug security review found
-- bypassable. Per 0027's own comment, the function is dropped and recreated
-- with a new required argument rather than given a defaulted one, which
-- would leave two PostgREST-resolvable overloads.

begin;

-- ── The codes ────────────────────────────────────────────────────────────

create table org_access_codes (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  email           text not null,
  status          text not null default 'pending'
                    check (status in ('pending', 'redeemed', 'revoked')),
  note            text,
  created_by      uuid not null references auth.users(id),
  created_at      timestamptz not null default now(),
  redeemed_by     uuid references auth.users(id),
  redeemed_org_id uuid references organizations(id),
  redeemed_at     timestamptz,
  revoked_at      timestamptz,

  constraint org_access_codes_lengths check (
    length(code) between 4 and 40
    and length(email) between 3 and 254
    and (note is null or length(note) <= 160)
  )
);

create index idx_org_access_codes_email on org_access_codes (lower(email));

alter table org_access_codes enable row level security;

-- Same shape as 0009's contact_requests: these are PAC's own records, not
-- tenant data, and the only person this table is "for" (the redeeming user)
-- has no employees row yet at the point they'd need to read it — they only
-- ever touch it through the two SECURITY DEFINER functions below.

create policy "access codes: super admin selects" on org_access_codes for select
  using ((select role from public.current_employee()) = 'super_admin');

create policy "access codes: super admin inserts" on org_access_codes for insert
  with check ((select role from public.current_employee()) = 'super_admin');

create policy "access codes: super admin updates" on org_access_codes for update
  using ((select role from public.current_employee()) = 'super_admin')
  with check ((select role from public.current_employee()) = 'super_admin');

-- ── Read-only pre-check, for onboarding UX only ─────────────────────────
--
-- Not the enforcement boundary — create_organization_for_self re-checks
-- everything itself. This exists so the wizard can reject a bad code before
-- someone fills out the rest of the form.

create function public.validate_access_code(access_code text)
returns table (ok boolean, reason text)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_email text;
  v_row   org_access_codes%rowtype;
begin
  if auth.uid() is null then
    return query select false, 'Not authenticated';
    return;
  end if;

  -- Read directly off the JWT rather than via the auth.email() convenience
  -- function, which isn't guaranteed present on every Supabase project
  -- vintage. This claim is always there for an authenticated request.
  v_email := lower((auth.jwt() ->> 'email'));

  select * into v_row
  from org_access_codes
  where code = access_code;

  if not found then
    return query select false, 'That access code was not recognised.';
    return;
  end if;

  if v_row.status <> 'pending' then
    return query select false, 'That access code has already been used or was revoked.';
    return;
  end if;

  if lower(v_row.email) <> v_email then
    return query select false, 'That access code was issued to a different email address.';
    return;
  end if;

  return query select true, null::text;
end;
$$;

revoke execute on function public.validate_access_code(text) from public, anon;
grant execute on function public.validate_access_code(text) to authenticated;

-- ── create_organization_for_self, with the code now required ───────────
--
-- Dropped, not overloaded: see the file header and 0027's own comment on
-- this function.

drop function if exists public.create_organization_for_self(
  text, text, double precision, double precision, text, integer
);

create function public.create_organization_for_self(
  org_name text,
  admin_name text,
  site_lat double precision,
  site_lng double precision,
  access_code text,
  site_name text default 'Head Office',
  site_radius_m integer default 150
)
returns table (org_id uuid, site_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id  uuid;
  v_site_id uuid;
  v_slug    text;
  v_code    org_access_codes%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from employees where id = auth.uid()) then
    raise exception 'This account is already linked to an organization';
  end if;

  if coalesce(trim(org_name), '') = '' then
    raise exception 'Organization name is required';
  end if;

  if coalesce(trim(admin_name), '') = '' then
    raise exception 'Your name is required';
  end if;

  if site_lat is null or site_lng is null
     or site_lat <> site_lat or site_lng <> site_lng
     or abs(site_lat) > 90 or abs(site_lng) > 180 then
    raise exception 'A valid site location is required';
  end if;

  if site_radius_m is null or site_radius_m < 20 or site_radius_m > 10000 then
    raise exception 'Site radius must be between 20 and 10000 metres';
  end if;

  -- The actual gate. Locked for update so two concurrent submits of the
  -- same code can't both pass the status check before either writes back.
  select * into v_code
  from org_access_codes
  where code = access_code
  for update;

  if not found then
    raise exception 'That access code was not recognised';
  end if;

  if v_code.status <> 'pending' then
    raise exception 'That access code has already been used or was revoked';
  end if;

  if lower(v_code.email) <> lower((auth.jwt() ->> 'email')) then
    raise exception 'That access code was issued to a different email address';
  end if;

  v_slug := trim(both '-' from
              lower(regexp_replace(trim(org_name), '[^a-zA-Z0-9]+', '-', 'g')))
            || '-' || replace(gen_random_uuid()::text, '-', '');

  insert into organizations (name, slug, plan_tier, billing_status)
  values (trim(org_name), v_slug, 'starter', 'trialing')
  returning id into v_org_id;

  insert into sites (org_id, name, geofence_lat, geofence_lng, geofence_radius_m)
  values (v_org_id, coalesce(nullif(trim(site_name), ''), 'Head Office'),
          site_lat, site_lng, site_radius_m)
  returning id into v_site_id;

  insert into employees (id, org_id, site_id, full_name, role)
  values (auth.uid(), v_org_id, v_site_id, trim(admin_name), 'org_admin');

  update org_access_codes
  set status = 'redeemed',
      redeemed_by = auth.uid(),
      redeemed_org_id = v_org_id,
      redeemed_at = now()
  where id = v_code.id;

  return query select v_org_id, v_site_id;
end;
$$;

revoke execute on function public.create_organization_for_self(
  text, text, double precision, double precision, text, text, integer
) from public, anon;

grant execute on function public.create_organization_for_self(
  text, text, double precision, double precision, text, text, integer
) to authenticated;

comment on function public.create_organization_for_self(
  text, text, double precision, double precision, text, text, integer
) is
  'Self-serve signup: one org, one site, one org_admin, atomically — now behind a single-use, email-bound access code issued from /super/access-codes. Do not add a defaulted parameter to this function; add a new migration that drops and recreates it, or PostgREST will see two resolvable overloads.';

commit;

notify pgrst, 'reload schema';

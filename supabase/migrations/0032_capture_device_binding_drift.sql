-- 0032 — Capture the device-binding feature, which exists only in production.
--
-- WHY THIS EXISTS
--
-- 0028 did this same job on 14 Aug and closed with the repository able to
-- rebuild what was running. It drifted again. A fresh diff of the 31 migration
-- files against the live schema (17 Aug 2026) found five objects in production
-- that no file creates, four of which are one coherent feature nobody wrote
-- down:
--
--   employees.registered_device_id   text
--   employees.device_bound_at        timestamptz
--   check_and_bind_device(text)      SECURITY DEFINER
--   admin_reset_device(uuid)         SECURITY DEFINER
--   leave_requests.reason            text          (unrelated, see below)
--
-- Together the first four are ONE DEVICE PER EMPLOYEE — an anti-buddy-punching
-- control. The employee's client calls check_and_bind_device() with a device
-- identifier; the first call binds it, every later call from a different device
-- raises DEVICE_MISMATCH. A manager or above clears the binding with
-- admin_reset_device() when somebody genuinely changes phone.
--
-- THIS IS LIVE, IN USE, AND NOT IN THE REPOSITORY. At the time of writing one
-- employee has a bound device and seven leave requests carry a reason. Nothing
-- in src/ calls either function, so the caller is outside this repository —
-- most likely the Expo mobile client, which is a separate codebase. Do not
-- delete any of this on the assumption it is dead: it is not.
--
-- Nothing below changes behaviour. Every statement is `if not exists` or
-- `create or replace`, and the two function bodies are transcribed verbatim
-- from the live definitions apart from whitespace. The point is that a deploy
-- from this repository rebuilds production, not that production changes.
--
-- ─────────────────────────────────────────────────────────────────────────
-- ONE DELIBERATE CHANGE, AND TWO GAPS LEFT ALONE
-- ─────────────────────────────────────────────────────────────────────────
--
-- CHANGED: both functions are revoked from `anon`. 0022 established the
-- posture — "an RPC nobody should call should not be callable" — and these
-- two arrived after it, so they were never covered. Neither can actually
-- succeed for an anonymous caller (both resolve the caller through auth.uid()
-- and raise when no employees row is found), so this closes a gap in principle
-- rather than a live hole, and cannot break a signed-in client. `authenticated`
-- keeps EXECUTE, because that is who legitimately calls them.
--
-- NOT FIXED 1: `registered_device_id` has no unique constraint, so one physical
-- device can bind to several employees. That weakens the control this feature
-- exists to provide — two colleagues could share a handset and both bind it.
-- Adding `unique` needs a duplicate check against live data first and a product
-- decision about what should happen when it collides (refuse the bind? steal
-- it? flag it?), so it is named here rather than smuggled into a capture
-- migration.
--
-- NOT FIXED 2: `admin_reset_device` lets a `manager` clear any binding in their
-- own organization, not just at their own site. Every other manager-tier rule
-- in this schema narrows to site via employee_site_id() (0008, narrowed 0012).
-- Changing it here would alter who can do what, which is not what this file is
-- for.
--
-- Safe to run twice.

begin;

-- ── The columns ─────────────────────────────────────────────────────────

alter table employees
  add column if not exists registered_device_id text,
  add column if not exists device_bound_at      timestamptz;

comment on column employees.registered_device_id is
  'One-device-per-employee binding, set by check_and_bind_device(). Null means unbound. Captured into migrations by 0032 — it ran in production for some time before being written down. NOT unique: see 0032 for why that is not a drive-by fix.';

comment on column employees.device_bound_at is
  'When registered_device_id was first bound. Cleared by admin_reset_device().';

-- `reason` is unrelated to device binding — it is the free-text note a staff
-- member gives when requesting leave. 0001 created leave_requests without it
-- and 0016 added only decided_by / decided_at / decision_note, so it entered
-- production by hand. Seven rows already carry one.
alter table leave_requests
  add column if not exists reason text;

comment on column leave_requests.reason is
  'Requester''s own note, supplied at submission. Distinct from decision_note (0016), which is the approver''s. Captured into migrations by 0032.';

-- ── Bind a device to the calling employee ───────────────────────────────
--
-- Transcribed verbatim from production. `for update` on the caller's own row
-- is what stops two concurrent first-binds from a pair of devices both seeing
-- null and both writing.

create or replace function public.check_and_bind_device(p_device_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current text;
begin
  if p_device_id is null or length(trim(p_device_id)) = 0 then
    raise exception 'INVALID_DEVICE_ID';
  end if;

  select registered_device_id into v_current
  from employees
  where id = auth.uid()
  for update;

  if not found then
    raise exception 'EMPLOYEE_NOT_FOUND';
  end if;

  if v_current is null then
    update employees
    set registered_device_id = p_device_id,
        device_bound_at = now()
    where id = auth.uid();
  elsif v_current <> p_device_id then
    raise exception 'DEVICE_MISMATCH';
  end if;
  -- else: matches already-bound device, nothing to do
end;
$$;

-- ── Clear a binding, for a manager and above ────────────────────────────

create or replace function public.admin_reset_device(p_employee_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller employees%rowtype;
  v_target employees%rowtype;
begin
  select * into v_caller from employees where id = auth.uid();
  if not found then
    raise exception 'NOT_AUTHORIZED';
  end if;

  select * into v_target from employees where id = p_employee_id;
  if not found then
    raise exception 'EMPLOYEE_NOT_FOUND';
  end if;

  if v_caller.role not in ('manager', 'org_admin', 'super_admin') then
    raise exception 'NOT_AUTHORIZED';
  end if;

  if v_caller.role <> 'super_admin' and v_caller.org_id <> v_target.org_id then
    raise exception 'NOT_AUTHORIZED';
  end if;

  update employees
  set registered_device_id = null,
      device_bound_at = null
  where id = p_employee_id;
end;
$$;

-- ── Grants ──────────────────────────────────────────────────────────────
--
-- `public` must be named or the revoke does nothing — both roles inherit
-- EXECUTE through the PUBLIC pseudo-role, which is the trap 0022 documents
-- after its own first attempt ran clean and changed nothing.

revoke execute on function public.check_and_bind_device(text) from public, anon;
revoke execute on function public.admin_reset_device(uuid)   from public, anon;

grant execute on function public.check_and_bind_device(text) to authenticated;
grant execute on function public.admin_reset_device(uuid)   to authenticated;

comment on function public.check_and_bind_device(text) is
  'Binds one device to the calling employee; raises DEVICE_MISMATCH from any other device thereafter. Captured by 0032 — ran in production before it was written down. Called from outside this repository (the mobile client), so do not delete it because src/ has no caller.';

comment on function public.admin_reset_device(uuid) is
  'Clears an employee''s device binding. Manager and above, within their own organization. Captured by 0032. Note it is org-scoped, not site-scoped, unlike every other manager-tier rule here — see 0032.';

commit;

notify pgrst, 'reload schema';

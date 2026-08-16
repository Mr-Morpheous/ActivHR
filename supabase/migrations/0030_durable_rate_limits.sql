-- 0030 — A rate limiter that survives a serverless request.
--
-- WHY THIS EXISTS
--
-- src/lib/rate-limit.ts keeps buckets in a module-scope Map, and says so:
--
--   "This deploys to Railway, which runs a long-lived Node process, so a Map in
--    module scope survives between requests and a counter in it actually counts.
--    On a serverless host it would not: each request can land on a cold,
--    separate instance, every bucket would start empty, and the limiter would be
--    decorative."
--
-- The deployment moved to Vercel, which is serverless. That paragraph stopped
-- being a caveat and became a description: every application rate limit — auth,
-- password reset, attendance, and the public contact form — has been decorative
-- since the move, because concurrent requests land on separate instances and a
-- cold start begins with an empty Map.
--
-- The interface was built for this. `RateLimitStore` exists so the Map could be
-- swapped without touching a call site, and this migration is the other half.
--
-- WHY POSTGRES RATHER THAN REDIS
--
-- Supabase is already here, already paid for, already has a connection from
-- every server action, and needs no new secret. Upstash or Vercel KV would be
-- faster, and are the right answer if this ever gets hot — but a new vendor and
-- a new key to leak, for a limiter guarding a contact form and a login page, is
-- not obviously the better trade. The store is an interface either way.
--
-- SLIDING WINDOW, not fixed
--
-- Kept from the in-memory implementation, whose reasoning holds: a fixed window
-- lets somebody spend the whole allowance at 0:59 and again at 1:01, which is
-- double the intended rate at exactly the moment an attacker cares about.

begin;

create table if not exists rate_limits (
  key        text primary key,
  -- Timestamps inside the current window, pruned on every hit. An array rather
  -- than a row per hit: one row per key means one lock and no cleanup fan-out,
  -- and these arrays are bounded by the limit itself.
  hits       timestamptz[] not null default '{}',
  updated_at timestamptz not null default now()
);

create index if not exists idx_rate_limits_updated on rate_limits (updated_at);

-- Nothing may read this table. It holds IP-derived keys, which are personal
-- data, and it is only ever touched through the SECURITY DEFINER function
-- below, called with the service role.
alter table rate_limits enable row level security;

comment on table rate_limits is
  'Sliding-window rate limit buckets. Written only by rate_limit_hit() via the service role. No RLS policy exists on purpose: nothing else should read IP-derived keys.';

-- ── The one operation ────────────────────────────────────────────────────

create or replace function public.rate_limit_hit(
  p_key       text,
  p_limit     integer,
  p_window_ms integer
)
returns table (allowed boolean, remaining integer, retry_after_ms integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now    timestamptz := clock_timestamp();
  v_cutoff timestamptz;
  v_hits   timestamptz[];
  v_count  integer;
begin
  if p_key is null or p_limit is null or p_limit < 1
     or p_window_ms is null or p_window_ms < 1 then
    raise exception 'rate_limit_hit requires a key, a positive limit and a positive window';
  end if;

  v_cutoff := v_now - make_interval(secs => p_window_ms / 1000.0);

  -- Ensure the row exists, then take a row lock. `for update` is what makes
  -- this correct under the concurrency a serverless host produces: two
  -- instances hitting the same key serialise here instead of each reading a
  -- stale count and both allowing the request.
  insert into rate_limits (key) values (p_key)
  on conflict (key) do nothing;

  select hits into v_hits from rate_limits where key = p_key for update;

  -- Prune outside the window.
  v_hits := array(
    select t from unnest(coalesce(v_hits, '{}'::timestamptz[])) t
    where t > v_cutoff
    order by t
  );
  v_count := coalesce(array_length(v_hits, 1), 0);

  if v_count >= p_limit then
    update rate_limits set hits = v_hits, updated_at = v_now where key = p_key;
    return query select
      false,
      0,
      greatest(0, (extract(epoch from (v_hits[1] + make_interval(secs => p_window_ms / 1000.0) - v_now)) * 1000))::integer;
    return;
  end if;

  v_hits := v_hits || v_now;
  update rate_limits set hits = v_hits, updated_at = v_now where key = p_key;

  return query select true, p_limit - coalesce(array_length(v_hits, 1), 0), 0;
end;
$$;

create or replace function public.rate_limit_reset(p_key text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from rate_limits where key = p_key;
$$;

-- Housekeeping. Buckets are abandoned the moment their window passes, and this
-- table is otherwise unbounded — an attacker rotating addresses would grow it
-- forever, which is what MAX_KEYS bounded in the in-memory version.
--
-- SCHEDULE THIS. purge_contact_requests was written and never scheduled, and
-- doc 14 has been carrying that as an open item ever since. Do not repeat it:
--   select cron.schedule('purge-rate-limits', '17 * * * *',
--                        $$select public.purge_rate_limits()$$);
create or replace function public.purge_rate_limits(p_older_than interval default '1 day')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from rate_limits where updated_at < now() - p_older_than;
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

-- Callable only by the service role, from a server action. Not by anon or
-- authenticated: a caller who can invoke this directly can burn somebody
-- else's bucket by key, which turns a rate limiter into a lockout tool.
-- 0022's lesson — a REVOKE must name `public`, or the default grant remains.
revoke execute on function public.rate_limit_hit(text, integer, integer)  from public, anon, authenticated;
revoke execute on function public.rate_limit_reset(text)                  from public, anon, authenticated;
revoke execute on function public.purge_rate_limits(interval)             from public, anon, authenticated;

commit;

notify pgrst, 'reload schema';

-- 0029 — Remove the last anonymous write path.
--
-- ✅ APPLIED AND VERIFIED — 18 Aug 2026, project cxwwxsuggzrczehfhohg.
--
-- This header said "NOT YET APPLIED" long after it had been, and
-- src/app/contact-actions.ts repeated the claim. A security audit on 18 Aug
-- read both and reported the anon write path as still open; it was not. A stale
-- "not done yet" is worse than no note at all, because it is believed.
--
-- Verified against the live database on 18 Aug 2026:
--   - pg_policies has zero INSERT policies on contact_requests
--   - the table comment below is present
--   - an anon POST to /rest/v1/contact_requests returns 401,
--     "new row violates row-level security policy" — the acceptance test in
--     step 4 of the original plan
--
-- The original deploy order, kept for the record, since it is the reason this
-- was staged rather than applied with the rest:
--
--   1. deploy the build containing the service-role contact action
--   2. submit the form on the live site and confirm the row lands
--   3. then apply this migration
--   4. confirm an anon POST to /rest/v1/contact_requests returns 401
--
-- WHY
--
-- 0009 gave contact_requests an anon INSERT policy so the public marketing form
-- could write without a session, and reasoned it was safe because the row
-- references nothing, cannot be read back, is bounded by a length constraint,
-- "plus the per-IP limit in the action".
--
-- That last clause was the weak one, and it was measured on 14 Aug 2026: a
-- hand-rolled anon POST to /rest/v1/contact_requests returned **201**. The
-- limiter lives in a server action; the anon key is inlined in the client
-- bundle. So the only rate limit standing in front of the only unauthenticated
-- write path in the schema could be skipped by not using the form.
--
-- With the insert moved to the service role, which bypasses RLS, this policy has
-- no remaining caller.
--
-- Safe to run twice.

begin;

drop policy if exists "contact: anyone may submit" on contact_requests;

comment on table contact_requests is
  'Public enquiry form. Written ONLY by the service role from src/app/contact-actions.ts, so the per-IP rate limit there cannot be bypassed. Do not re-add an anon insert policy — see 0029.';

commit;

notify pgrst, 'reload schema';

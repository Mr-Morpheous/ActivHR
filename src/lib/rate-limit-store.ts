import { createClient } from "@supabase/supabase-js";

import type { RateLimitStore, RateLimitResult } from "./rate-limit";

/**
 * A rate-limit store that survives a serverless request.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 *
 * `MemoryStore` keeps buckets in a module-scope Map, and its own docblock says
 * that only works on a host running one long-lived process. The deployment
 * moved to Vercel, where each request may land on a cold, separate instance —
 * so every bucket started empty and every application rate limit became
 * decorative. Not a hypothetical: that paragraph described the situation.
 *
 * `RateLimitStore` was built as an interface for exactly this swap, so no call
 * site changes.
 *
 * ── Why Postgres rather than Redis ───────────────────────────────────────
 *
 * Supabase is already here, already paid for, and needs no new secret. Upstash
 * or Vercel KV are faster and are the right answer if this ever gets hot, but a
 * new vendor and another key to leak — to guard a login form and a contact
 * form — is not obviously the better trade. Swapping again is one file.
 *
 * ── This file is not unit-testable, on purpose ───────────────────────────
 *
 * It imports the Supabase client, so `node --test` cannot load it. That is why
 * it is separate from `rate-limit.ts`, which stays pure and holds all the logic
 * worth testing (key derivation, the IP strategy, message formatting). The
 * window arithmetic lives in migration 0030 and is verified there.
 */

/** Service role: migration 0030 revokes these functions from anon and authenticated. */
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function createPostgresRateLimitStore(): RateLimitStore {
  return {
    async hit(key, limit, windowMs): Promise<RateLimitResult> {
      const supabase = serviceClient();

      const { data, error } = await supabase
        .rpc("rate_limit_hit", {
          p_key: key,
          p_limit: limit,
          p_window_ms: windowMs,
        })
        .maybeSingle<{ allowed: boolean; remaining: number; retry_after_ms: number }>();

      if (error || !data) {
        // FAILS OPEN, deliberately, and loudly.
        //
        // A limiter that cannot reach its store has two options: refuse
        // everything, or allow everything. Refusing turns a database blip into
        // a total outage of sign-in, clock-in and the contact form — a much
        // larger incident than the abuse this prevents. GoTrue's own limits
        // still stand in front of auth either way.
        //
        // If this line appears in the logs, the limiter is not running. It is
        // not a warning about a slow query.
        console.error(
          "[rate-limit] store unavailable, allowing request:",
          error?.message ?? "no row returned"
        );
        return { ok: true, remaining: limit, retryAfterMs: 0 };
      }

      return {
        ok: data.allowed,
        remaining: data.remaining,
        retryAfterMs: data.retry_after_ms,
      };
    },

    async reset(key) {
      const supabase = serviceClient();
      const { error } = await supabase.rpc("rate_limit_reset", { p_key: key });
      if (error) {
        // Only ever called after a successful sign-in, to free that account's
        // bucket. Failing means somebody stays throttled slightly longer than
        // intended, which is not worth surfacing to them.
        console.error("[rate-limit] reset failed:", error.message);
      }
    },
  };
}

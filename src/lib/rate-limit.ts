import { createPostgresRateLimitStore } from "./rate-limit-store";

/**
 * Rate limiting configuration for authentication endpoints.
 *
 * Uses Postgres-backed durable store (migration 0030) for production.
 * Falls back to in-memory store for local development.
 */

const POSTGRES_AVAILABLE =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const store = POSTGRES_AVAILABLE
  ? createPostgresRateLimitStore()
  : {
      async hit(key: string, limit: number, windowMs: number) {
        const now = Date.now();
        const entry = memoryStore.get(key);
        if (!entry || now > entry.resetTime) {
          memoryStore.set(key, { count: 1, resetTime: now + windowMs });
          return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
        }
        if (entry.count >= limit) {
          return { ok: false, remaining: 0, retryAfterMs: entry.resetTime - now };
        }
        entry.count++;
        return { ok: true, remaining: limit - entry.count, retryAfterMs: 0 };
      },
      async reset(key: string) {
        memoryStore.delete(key);
      },
    };

const memoryStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Key derivation lives in `rate-limit-key.ts`, which imports nothing.
 *
 * It was moved there so `node --test` can load it: this file imports the
 * Postgres store, which imports @supabase/supabase-js, so the whole chain was
 * unloadable under Node's ESM resolver and `rate-limit.test.mts` had been
 * failing at import — taking twelve IPv6 and header-precedence assertions with
 * it. Re-exported here so every existing call site keeps working unchanged.
 */
export { clientIpFrom, rateLimitKeyForIp, retryAfterMessage } from "./rate-limit-key";

/** Create a rate limiter with the given key prefix, window, and max requests. */
export function createLimiter(keyPrefix: string, windowMs: number, maxRequests: number) {
  return {
    async check(identifier: string | number) {
      const key = `${keyPrefix}:${identifier}`;
      return await store.hit(key, maxRequests, windowMs);
    },
    async reset(identifier: string | number) {
      const key = `${keyPrefix}:${identifier}`;
      await store.reset(key);
    },
  };
}

/** Pre-configured limiters used across the app. */
export const authIpLimiter = createLimiter("auth:ip", 15 * 60 * 1000, 10); // 10 per 15 min
export const authIdentifierLimiter = createLimiter("auth:id", 15 * 60 * 1000, 10); // 10 per 15 min
export const passwordResetLimiter = createLimiter("reset", 60 * 60 * 1000, 5); // 5 per hour
export const contactLimiter = createLimiter("contact", 60 * 60 * 1000, 5); // 5 per hour
export const attendanceLimiter = createLimiter("attendance", 60 * 1000, 30); // 30 per minute

/** Types for the rate-limit store interface. */
export interface RateLimitStore {
  hit(key: string, limit: number, windowMs: number): Promise<{
    ok: boolean;
    remaining: number;
    retryAfterMs: number;
  }>;
  reset(key: string): Promise<void>;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

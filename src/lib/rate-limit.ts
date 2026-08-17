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

/** Extract client IP from Next.js headers. */
export function clientIpFrom(headers: Headers): string {
  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const ip = vercel.split(",")[0]?.trim();
    if (ip) return rateLimitKeyForIp(ip);
  }

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return rateLimitKeyForIp(ip);
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    const ip = realIp.trim();
    if (ip) return rateLimitKeyForIp(ip);
  }

  return "unknown";
}

/** Collapse an IP address to a rate-limit bucket key.
 *
 * IPv4 keys on the full address.
 * IPv6 collapses to its /64 so one host with many addresses does not get
 * unlimited fresh buckets.
 * Unknown/empty strings become the literal "unknown" bucket.
 */
export function rateLimitKeyForIp(rawIp: string): string {
  const ip = (rawIp ?? "").trim();
  if (!ip || ip === "unknown") return "unknown";

  // Strip zone id and brackets from IPv6
  const cleaned = ip.replace(/%.*$/, "").replace(/^\[|\]$/g, "");

  if (cleaned.includes(":")) {
    // IPv6: collapse to /64
    const parts = cleaned.split(":");
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}::/64`;
    }
    return cleaned;
  }

  // IPv4
  return cleaned;
}

/** Format retry-after milliseconds into a human-readable message. */
export function retryAfterMessage(retryAfterMs: number): string {
  if (retryAfterMs <= 0) return "Please try again in a moment.";
  const seconds = Math.ceil(retryAfterMs / 1000);
  if (seconds < 60) return `Please try again in ${seconds} second${seconds > 1 ? "s" : ""}.`;
  const minutes = Math.ceil(seconds / 60);
  return `Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`;
}

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

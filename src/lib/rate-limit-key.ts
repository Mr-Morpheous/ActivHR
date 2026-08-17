/**
 * Rate-limit key derivation — the pure half of the limiter.
 *
 * ── Why this file is separate ────────────────────────────────────────────
 *
 * `rate-limit-store.ts` claims, in its own docblock, that "rate-limit.ts stays
 * pure and holds all the logic worth testing". That stopped being true the
 * moment `rate-limit.ts` began importing the store to pick a backend: the
 * store imports `@supabase/supabase-js`, so `node --test` could no longer load
 * the chain at all and `rate-limit.test.mts` failed at import with
 * ERR_MODULE_NOT_FOUND. Twelve assertions — every IPv6 /64 case and the whole
 * header-precedence strategy — silently stopped running from that point.
 *
 * This module imports NOTHING, which is the constraint every other tested
 * module here observes (leave-balance.ts, billing.ts, notice-audience.ts,
 * tenant-summary.ts, org-levels.ts). `rate-limit.ts` re-exports all three
 * functions, so no call site changed.
 */

/**
 * Collapse an IP address to a rate-limit bucket key.
 *
 * IPv4 keys on the full address. IPv6 collapses to its /64: a single host
 * routed a /64 would otherwise get effectively unlimited fresh buckets, and
 * could also flood the store's key space to evict a *targeted* account's
 * bucket and reset its attempt count. Unknown/empty becomes the literal
 * "unknown" bucket.
 */
export function rateLimitKeyForIp(rawIp: string): string {
  const ip = (rawIp ?? "").trim();
  if (!ip || ip === "unknown") return "unknown";

  // Strip zone id and brackets from IPv6, so [::1]%eth0 and ::1 share a bucket.
  const cleaned = ip.replace(/%.*$/, "").replace(/^\[|\]$/g, "");

  if (cleaned.includes(":")) {
    const parts = cleaned.split(":");
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}::/64`;
    }
    return cleaned;
  }

  return cleaned;
}

/**
 * Extract the client IP from request headers.
 *
 * `x-vercel-forwarded-for` is preferred because Vercel's edge sets it and a
 * caller cannot prepend to it. `x-forwarded-for` is read LEFTMOST, which is
 * correct on Vercel's single-hop shape — note this is deliberately the
 * opposite of the Railway-era code, where the rightmost entry was the trusted
 * one. Getting this backwards is how doc 14's bypass happened; if a second
 * proxy is ever put in front, this has to be revisited.
 */
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

/** Format retry-after milliseconds into a human-readable message. */
export function retryAfterMessage(retryAfterMs: number): string {
  if (retryAfterMs <= 0) return "Please try again in a moment.";
  const seconds = Math.ceil(retryAfterMs / 1000);
  if (seconds < 60) return `Please try again in ${seconds} second${seconds > 1 ? "s" : ""}.`;
  const minutes = Math.ceil(seconds / 60);
  return `Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`;
}

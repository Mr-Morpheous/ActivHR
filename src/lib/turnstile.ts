/**
 * Server-side Cloudflare Turnstile verification.
 *
 * WHY THIS EXISTS
 * ────────────────────────────────────────────────────────────────────────────
 * The widget (`site/turnstile.tsx`) has been rendering on /login for a while,
 * and every server action that received its token accepted it as an unused
 * parameter and threw it away — `_turnstileToken?: string | null`. There was no
 * `siteverify` call anywhere in the codebase. A token is worthless until the
 * issuer confirms it, so bot protection was decorative: a scripted POST with no
 * token, or a made-up one, was indistinguishable from a real submission.
 *
 * THE FAIL-OPEN / FAIL-CLOSED POLICY
 * ────────────────────────────────────────────────────────────────────────────
 * Deliberate, because "always fail closed" would take down lead capture and
 * sign-in in any environment without the secret, including local development:
 *
 *  1. **Neither key set** → allow. Turnstile is not deployed, the widget never
 *     renders, and no token can exist. This is local dev and preview builds.
 *  2. **Site key set, secret missing** → REJECT, and log loudly. The widget is
 *     visible to users, so the deployment is claiming protection it cannot
 *     provide. That is a misconfiguration to surface, not to paper over.
 *  3. **Both set, token missing or rejected by Cloudflare** → reject. This is
 *     the case the handbook's acceptance test describes.
 *  4. **Both set, Cloudflare unreachable or slow** → allow, and log. An outage
 *     at Cloudflare should not stop a real customer from contacting the
 *     business, and the per-IP rate limiter still applies underneath. This is
 *     the one deliberate hole, and it is bounded by a 5s timeout.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const TIMEOUT_MS = 5000;

export type TurnstileVerdict =
  | { ok: true }
  | { ok: false; reason: "missing-token" | "rejected" | "misconfigured" };

/** True when the widget will render for users, i.e. a token should arrive. */
export function turnstileEnabled() {
  return !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}

export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string
): Promise<TurnstileVerdict> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Case 1 — Turnstile is not deployed at all.
  if (!siteKey && !secret) return { ok: true };

  // Case 2 — the user is being shown a challenge we cannot check.
  if (!secret) {
    console.error(
      "[turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is set but TURNSTILE_SECRET_KEY is not — " +
        "rejecting rather than accepting an unverifiable token"
    );
    return { ok: false, reason: "misconfigured" };
  }

  // Case 3a — no token to check.
  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams({ secret, response: token });
  // Cloudflare uses this to catch a token replayed from a different address.
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      // Case 4 — transport-level failure.
      console.error("[turnstile] siteverify HTTP", response.status);
      return { ok: true };
    }

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    // Case 3b — Cloudflare gave an explicit verdict, and it was no.
    if (!result.success) {
      console.warn(
        "[turnstile] token rejected:",
        (result["error-codes"] ?? []).join(",") || "no error code"
      );
      return { ok: false, reason: "rejected" };
    }

    return { ok: true };
  } catch (error) {
    // Case 4 — timeout or network error. Allow, and say so in the logs.
    console.error(
      "[turnstile] siteverify unreachable, allowing submission:",
      error instanceof Error ? error.message : error
    );
    return { ok: true };
  }
}

/** User-facing copy per rejection reason. Never leaks configuration detail. */
export function turnstileMessage(reason: Exclude<TurnstileVerdict, { ok: true }>["reason"]) {
  switch (reason) {
    case "missing-token":
      return "Please complete the verification challenge and try again.";
    case "rejected":
      return "That verification didn't check out. Reload the page and try again.";
    case "misconfigured":
      return "We couldn't verify that request. Please try again shortly.";
  }
}

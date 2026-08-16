import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiting configuration for authentication endpoints.
 * 
 * Uses in-memory store for simplicity. For production with multiple
 * instances, replace with Upstash Redis or similar distributed store.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 attempts per minute

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : request.ip || "unknown";
  return ip;
}

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New window or expired
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetTime: entry.resetTime };
}

export function applyRateLimitHeaders(
  response: NextResponse,
  result: { allowed: boolean; remaining: number; resetTime: number }
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)));

  if (!result.allowed) {
    response.headers.set("Retry-After", String(Math.ceil((result.resetTime - Date.now()) / 1000)));
  }

  return response;
}

export function isRateLimited(request: NextRequest): NextResponse | null {
  const identifier = getClientIdentifier(request);
  const result = checkRateLimit(identifier);

  if (!result.allowed) {
    const response = NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
    return applyRateLimitHeaders(response, result);
  }

  return null;
}

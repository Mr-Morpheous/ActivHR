import { test } from "node:test";
import assert from "node:assert/strict";

// Imported from the pure module, not from `rate-limit.ts`. That file pulls in
// the Postgres store (and so @supabase/supabase-js), which Node's ESM resolver
// cannot load under `node --test` — which is exactly why this suite was
// silently failing at import before rate-limit-key.ts was split out.
import { rateLimitKeyForIp, clientIpFrom, retryAfterMessage } from "./rate-limit-key.ts";

const h = (entries: Record<string, string>) => new Headers(entries);

test("IPv4 addresses key on themselves", () => {
  assert.equal(rateLimitKeyForIp("41.90.64.12"), "41.90.64.12");
});

test("IPv6 addresses collapse to their /64", () => {
  assert.equal(
    rateLimitKeyForIp("2001:db8:1234:5678:9abc:def0:1234:5678"),
    "2001:db8:1234:5678::/64"
  );
});

test("two addresses in one /64 share a bucket", () => {
  // The bypass this exists for: a single host routed a /64 otherwise gets
  // effectively unlimited fresh buckets.
  assert.equal(
    rateLimitKeyForIp("2001:db8:1234:5678:1::1"),
    rateLimitKeyForIp("2001:db8:1234:5678:ffff::9")
  );
});

test("different /64s do not share a bucket", () => {
  assert.notEqual(
    rateLimitKeyForIp("2001:db8:1234:5678::1"),
    rateLimitKeyForIp("2001:db8:1234:9999::1")
  );
});

test("a zone id or brackets do not create a separate bucket", () => {
  const plain = rateLimitKeyForIp("2001:db8:1234:5678::1");
  assert.equal(rateLimitKeyForIp("[2001:db8:1234:5678::1]"), plain);
  assert.equal(rateLimitKeyForIp("2001:db8:1234:5678::1%eth0"), plain);
});

test("unknown and empty stay unknown rather than becoming a shared bucket name", () => {
  assert.equal(rateLimitKeyForIp("unknown"), "unknown");
  assert.equal(rateLimitKeyForIp("   "), "unknown");
});

test("x-vercel-forwarded-for wins, because a caller cannot prepend to it", () => {
  // The attack: send your own x-forwarded-for. Vercel's own header is set at
  // the edge, so it is preferred over the list.
  assert.equal(
    clientIpFrom(h({
      "x-vercel-forwarded-for": "41.90.64.12",
      "x-forwarded-for": "1.2.3.4, 41.90.64.12",
    })),
    "41.90.64.12"
  );
});

test("falls back to the leftmost x-forwarded-for entry (Vercel's shape)", () => {
  assert.equal(clientIpFrom(h({ "x-forwarded-for": "41.90.64.12, 10.0.0.1" })), "41.90.64.12");
});

test("falls back to x-real-ip when no forwarded header is present", () => {
  assert.equal(clientIpFrom(h({ "x-real-ip": "41.90.64.12" })), "41.90.64.12");
});

test("no headers at all yields one shared 'unknown' bucket, not a crash", () => {
  assert.equal(clientIpFrom(h({})), "unknown");
});

test("a forwarded IPv6 client is /64-keyed, not keyed per address", () => {
  assert.equal(
    clientIpFrom(h({ "x-forwarded-for": "2001:db8:aaaa:bbbb:1::9, 10.0.0.1" })),
    "2001:db8:aaaa:bbbb::/64"
  );
});

test("retryAfterMessage switches to minutes past 90 seconds", () => {
  assert.match(retryAfterMessage(1_000), /1 second\b/);
  assert.match(retryAfterMessage(45_000), /45 seconds/);
  assert.match(retryAfterMessage(600_000), /10 minutes/);
});

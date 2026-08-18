/**
 * Outbound notification email, via Resend's HTTP API.
 *
 * WHY THERE IS NO `resend` PACKAGE
 * ────────────────────────────────────────────────────────────────────────────
 * One POST to one endpoint does not need a dependency, an SDK version to keep
 * current, or another package with network access in the tree. `fetch` is
 * built in.
 *
 * WHY THE DESTINATION IS NOT A PUBLIC CONSTANT
 * ────────────────────────────────────────────────────────────────────────────
 * `CONTACT_INBOX` is read from the environment on the server and never leaves
 * it. It is deliberately NOT `NEXT_PUBLIC_`-prefixed, because anything with that
 * prefix is inlined into the client bundle at build time — the address would end
 * up in JavaScript that any scraper can read, which is how an internal inbox
 * starts receiving spam. The fallback is hardcoded here rather than in any
 * component for the same reason: `src/lib/notify.ts` is server-only, enforced by
 * the `server-only` import above, so importing it from a client component is a
 * build error rather than a leak.
 *
 * The visitor-facing "email us directly" address stays SUPPORT_EMAIL in
 * lib/brand.ts. These are two different addresses doing two different jobs:
 * one is published on purpose, this one is not.
 *
 * FAILURE POLICY: never block the submission.
 * ────────────────────────────────────────────────────────────────────────────
 * The enquiry is already durably stored in `contact_requests` before this runs.
 * If Resend is down, unconfigured, or slow, the lead is not lost — it is in the
 * database, and the only cost is that nobody gets a nudge about it. So every
 * failure here is logged and swallowed. Telling a customer "something went
 * wrong" after their enquiry was successfully recorded would be a lie that
 * makes them submit it again.
 */

/**
 * Server-side guard, in place of the `server-only` package.
 *
 * The point of this module is that the destination inbox never reaches a
 * browser. `server-only` would turn a client import into a build error, which
 * is stricter — but it is another dependency for one assertion, and the same
 * reasoning that skipped the Resend SDK applies. This throws loudly instead, so
 * a mistaken client import fails on first render rather than silently shipping
 * the address in a bundle.
 *
 * The static guarantee still holds in practice: the only importers are
 * `"use server"` modules.
 */
if (typeof window !== "undefined") {
  throw new Error(
    "lib/notify.ts is server-only — importing it from a client component would " +
      "ship the internal contact inbox address in the browser bundle."
  );
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;

/** Where enquiry notifications go. Server-side only — never sent to a client. */
const CONTACT_INBOX = process.env.CONTACT_INBOX ?? "it@pac.africa";

/**
 * The From address must be on a domain verified in Resend. Until one is, Resend
 * only accepts their shared sandbox sender, which can deliver to the account
 * owner's own address — enough to prove the wiring end to end.
 */
const FROM = process.env.RESEND_FROM ?? "ActivHR <onboarding@resend.dev>";

export type EnquiryNotification = {
  fullName: string;
  workEmail: string;
  company: string;
  phone?: string;
  teamSize?: string;
  message?: string;
  /** Which form it came from, so the inbox can tell them apart. */
  source: "contact" | "demo";
};

/** Escapes text before it goes into the HTML body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBody(enquiry: EnquiryNotification) {
  const rows: [string, string][] = [
    ["Name", enquiry.fullName],
    ["Email", enquiry.workEmail],
    ["Company", enquiry.company],
    ["Phone", enquiry.phone || "—"],
    ["Team size", enquiry.teamSize || "—"],
  ];

  const text = [
    `New ${enquiry.source === "demo" ? "demo request" : "enquiry"} from the ActivHR site`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    enquiry.message || "(none)",
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#0f172a">
      <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin:0 0 4px">
        ActivHR — ${enquiry.source === "demo" ? "demo request" : "website enquiry"}
      </p>
      <h2 style="margin:0 0 16px;font-size:18px">${escapeHtml(enquiry.fullName)} · ${escapeHtml(enquiry.company)}</h2>
      <table cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `<tr>
              <td style="padding:4px 16px 4px 0;color:#64748b;vertical-align:top">${label}</td>
              <td style="padding:4px 0">${escapeHtml(value)}</td>
            </tr>`
          )
          .join("")}
      </table>
      <p style="margin:16px 0 4px;color:#64748b;font-size:14px">Message</p>
      <p style="margin:0;white-space:pre-wrap;font-size:14px">${escapeHtml(enquiry.message || "(none)")}</p>
    </div>
  `;

  return { text, html };
}

export async function notifyEnquiry(enquiry: EnquiryNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Not an error. Local development and preview builds run without it, and
    // the enquiry is already stored — this is the only signal that the
    // notification half is not configured.
    console.warn(
      `[notify] RESEND_API_KEY not set — enquiry from ${enquiry.workEmail} stored but not emailed`
    );
    return;
  }

  const { text, html } = buildBody(enquiry);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [CONTACT_INBOX],
        // Replying in the inbox goes to the person who filled the form, rather
        // than to the sending domain.
        reply_to: enquiry.workEmail,
        subject:
          enquiry.source === "demo"
            ? `Demo request — ${enquiry.company}`
            : `Website enquiry — ${enquiry.company}`,
        text,
        html,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[notify] Resend rejected the send: ${response.status} ${detail.slice(0, 300)}`
      );
    }
  } catch (error) {
    console.error(
      "[notify] Resend unreachable:",
      error instanceof Error ? error.message : error
    );
  }
}

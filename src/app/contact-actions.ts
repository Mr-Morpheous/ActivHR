"use server";

import { headers } from "next/headers";
import { createClient as createServiceClient } from "@supabase/supabase-js";

import { SUPPORT_EMAIL } from "@/lib/brand";
import {
  clientIpFrom,
  contactLimiter,
  retryAfterMessage,
} from "@/lib/rate-limit";
import { turnstileMessage, verifyTurnstile } from "@/lib/turnstile";
import { notifyEnquiry } from "@/lib/notify";

/**
 * The landing page's pilot enquiry form.
 *
 * ── Why this writes with the service role ────────────────────────────────
 *
 * This used to insert with the anon client, backed by an anon INSERT policy on
 * contact_requests (0009). That made the rate limit below decorative: the anon
 * key is inlined in the client bundle, so anyone could POST straight to
 * /rest/v1/contact_requests and never touch this code. Verified against
 * production on 14 Aug — a hand-rolled anon insert returned 201.
 *
 * Writing with the service role means the limiter is the only way in, because
 * migration 0029 removes the anon policy and there is then no other path.
 *
 * 0029 IS APPLIED. Verified against the live database on 18 Aug 2026: no INSERT
 * policy remains on contact_requests, and an anon POST to
 * /rest/v1/contact_requests returns 401. This comment previously said 0029 was
 * "deliberately left unapplied", which was true when written and stale by the
 * time anyone read it — an audit believed it and reported an open write path
 * that had already been closed.
 *
 * The deploy order that made it a staged migration still holds if it is ever
 * re-run against a fresh environment: this code must be live before the policy
 * is dropped, or the public form breaks against a policy that no longer exists.
 */
function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  fullName: 120,
  workEmail: 254,
  company: 160,
  phone: 40,
  teamSize: 40,
  message: 2000,
} as const;

export type ContactInput = {
  fullName: string;
  workEmail: string;
  company: string;
  phone?: string;
  teamSize?: string;
  message?: string;
};

/** Per-field messages, keyed to the input name so a form can place each one. */
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactResult = {
  /** Form-level problem: rate limit, verification, storage failure. */
  error?: string;
  /** Field-level problems, rendered next to the field that caused them. */
  fieldErrors?: ContactFieldErrors;
  success?: true;
};

export async function submitContactRequest(
  input: ContactInput,
  turnstileToken?: string | null,
  /**
   * Which form this came from. Only affects the notification subject line —
   * both write to the same table.
   */
  source: "contact" | "demo" = "contact"
): Promise<ContactResult> {
  const ip = clientIpFrom(await headers());

  const quota = await contactLimiter.check(ip);
  if (!quota.ok) {
    return {
      error: `You've sent a few requests already. ${retryAfterMessage(quota.retryAfterMs)}`,
    };
  }

  // The token used to arrive here as `_turnstileToken` and go straight in the
  // bin, which made the widget on the form decorative. Checked before any
  // validation work so a scripted request costs as little as possible.
  const challenge = await verifyTurnstile(turnstileToken, ip);
  if (!challenge.ok) {
    return { error: turnstileMessage(challenge.reason) };
  }

  // Trim but DO NOT truncate. This used to `.slice(0, max)`, which silently
  // accepted oversized input and stored a cut-off version — the caller was
  // told nothing, and the record was quietly wrong. Over-length input is now a
  // field error, so the person can see it and fix it.
  const trim = (value: string | undefined) => (value ?? "").trim();

  const fullName = trim(input.fullName);
  const workEmail = trim(input.workEmail).toLowerCase();
  const company = trim(input.company);
  const phone = trim(input.phone);
  const teamSize = trim(input.teamSize);
  const message = trim(input.message);

  const fieldErrors: ContactFieldErrors = {};

  const tooLong = (
    field: keyof ContactInput,
    value: string,
    max: number,
    label: string
  ) => {
    if (value.length > max) {
      fieldErrors[field] = `${label} is too long — ${max} characters maximum.`;
    }
  };

  if (!fullName) fieldErrors.fullName = "Enter your name.";
  else tooLong("fullName", fullName, LIMITS.fullName, "Your name");

  if (!workEmail) fieldErrors.workEmail = "Enter your work email address.";
  else if (!EMAIL_PATTERN.test(workEmail)) {
    fieldErrors.workEmail = "That doesn't look like an email address.";
  } else tooLong("workEmail", workEmail, LIMITS.workEmail, "Your email address");

  if (!company) fieldErrors.company = "Enter your company name.";
  else tooLong("company", company, LIMITS.company, "Your company name");

  tooLong("phone", phone, LIMITS.phone, "That phone number");
  tooLong("teamSize", teamSize, LIMITS.teamSize, "That team size");
  tooLong("message", message, LIMITS.message, "Your message");

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  // Fails closed with the same generic message the insert failure uses: a
  // missing key is an operator problem, and the public form must not explain
  // the deployment's configuration to whoever is reading it.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[contact] SUPABASE_SERVICE_ROLE_KEY is not set");
    return {
      error: `We couldn't record that just now. Email ${SUPPORT_EMAIL} directly and we'll pick it up.`,
    };
  }

  const supabase = serviceClient();

  const { error } = await supabase.from("contact_requests").insert({
    full_name: fullName,
    work_email: workEmail,
    company,
    phone: phone || null,
    team_size: teamSize || null,
    message: message || null,
    source_ip: ip === "unknown" ? null : ip,
    status: "new",
  });

  if (error) {
    // Don't surface the database error: this form is public, and PostgREST
    // messages name tables, columns and constraints.
    console.error("[contact] insert failed", error.message);
    return {
      error:
        `We couldn't record that just now. Email ${SUPPORT_EMAIL} directly and we'll pick it up.`,
    };
  }

  // Awaited, not fired and forgotten. A serverless function can be frozen the
  // moment its response is returned, which kills an un-awaited promise
  // mid-flight — the classic way notification emails go missing in production
  // while working perfectly in local development.
  //
  // Awaiting is safe because `notifyEnquiry` never throws and never rejects: it
  // swallows its own failures. The row is already committed above, so the worst
  // case is a lead that is stored but not announced, which is recoverable from
  // the table. It costs the submitter up to the 8s Resend timeout.
  await notifyEnquiry({
    fullName,
    workEmail,
    company,
    phone,
    teamSize,
    message,
    source,
  });

  return { success: true as const };
}

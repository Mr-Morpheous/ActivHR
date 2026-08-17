"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import {
  submitContactRequest,
  type ContactFieldErrors,
} from "@/app/contact-actions";
import { SUPPORT_EMAIL as CONTACT_ADDRESS } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@/components/site/turnstile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * The demo request form.
 *
 * WHAT THIS REPLACES
 * ────────────────────────────────────────────────────────────────────────────
 * A `<form>` with no `onSubmit`, no `action`, and no `name` attribute on any
 * input. Pressing "Request Demo" performed a GET back to /demo and discarded
 * every field — on a page that promises "a solution specialist will reach out
 * within 2 business hours". Every lead that page ever captured was lost. Its
 * `<label>`s also had no `htmlFor` and its inputs no `id`, so nothing was
 * announced to a screen reader either.
 *
 * It writes through `submitContactRequest`, the same rate-limited,
 * Turnstile-verified server action the landing page's contact form uses, rather
 * than introducing a second storage path with its own bugs. The demo-specific
 * fields that `contact_requests` has no column for — workforce size and primary
 * focus — are folded into the message so nothing the person typed is dropped.
 */

const WORKFORCE_SIZES = ["1–50", "51–300", "300+"];

const FOCUS_AREAS = [
  "Attendance & Time Tracking",
  "Payroll & Statutory Compliance",
  "Employee Onboarding",
  "Performance Management",
  "Mobile ESS / WhatsApp",
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function DemoForm() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "sent">(
    "idle"
  );
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<ContactFieldErrors>({});
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  // Controlled because Radix Select renders a button, not a native <select>,
  // so its value does not appear in FormData on its own.
  const [workforce, setWorkforce] = React.useState("");
  const [focus, setFocus] = React.useState("");
  const [workforceError, setWorkforceError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setWorkforceError(null);

    // Validated here rather than server-side because `contact_requests` has no
    // column for it — the server sees it only as part of `message`, so it
    // cannot report a field error against it.
    if (!workforce) {
      setWorkforceError("Choose a workforce size.");
      return;
    }

    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();

    const notes = [
      `Workforce size: ${workforce}`,
      focus ? `Primary focus: ${focus}` : null,
      value("message") ? `\n${value("message")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const result = await submitContactRequest(
        {
          fullName: [value("firstName"), value("lastName")]
            .filter(Boolean)
            .join(" "),
          workEmail: value("workEmail"),
          company: value("company"),
          teamSize: workforce,
          message: notes,
        },
        turnstileToken
      );

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        setStatus("idle");
        return;
      }

      if (result.error) {
        setError(result.error);
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setError(
        `Something went wrong. Email ${CONTACT_ADDRESS} directly and we'll pick it up.`
      );
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-border bg-card px-6 py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-5" />
        </span>
        <h3 className="font-serif text-2xl">Demo request received.</h3>
        <p className="max-w-sm text-muted-foreground">
          A specialist will be in touch to schedule your walkthrough. If
          it&apos;s urgent, email{" "}
          <a className="text-primary underline" href={`mailto:${CONTACT_ADDRESS}`}>
            {CONTACT_ADDRESS}
          </a>
          .
        </p>
      </div>
    );
  }

  // `fullName` is assembled from two inputs, so a server error against it has
  // no single field to attach to — it is shown against the first name.
  const describe = (field: keyof ContactFieldErrors) =>
    fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `demo-${field}-error` }
      : {};

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="demo-firstName">First name</Label>
          <Input
            id="demo-firstName"
            name="firstName"
            placeholder="Jane"
            {...describe("fullName")}
          />
          <FieldError id="demo-fullName-error" message={fieldErrors.fullName} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="demo-lastName">Last name</Label>
          <Input id="demo-lastName" name="lastName" placeholder="Doe" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-workEmail">Work email</Label>
        <Input
          id="demo-workEmail"
          name="workEmail"
          type="email"
          placeholder="jane@company.com"
          {...describe("workEmail")}
        />
        <FieldError id="demo-workEmail-error" message={fieldErrors.workEmail} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-company">Company name</Label>
        <Input
          id="demo-company"
          name="company"
          placeholder="Acme Ltd"
          {...describe("company")}
        />
        <FieldError id="demo-company-error" message={fieldErrors.company} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="demo-workforce">Workforce size</Label>
          <Select value={workforce} onValueChange={setWorkforce}>
            <SelectTrigger
              id="demo-workforce"
              aria-invalid={workforceError ? true : undefined}
              aria-describedby={workforceError ? "demo-workforce-error" : undefined}
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {WORKFORCE_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError
            id="demo-workforce-error"
            message={workforceError ?? undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="demo-focus">Primary HR focus</Label>
          <Select value={focus} onValueChange={setFocus}>
            <SelectTrigger id="demo-focus">
              <SelectValue placeholder="Select focus" />
            </SelectTrigger>
            <SelectContent>
              {FOCUS_AREAS.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-message">Message (optional)</Label>
        <Textarea
          id="demo-message"
          name="message"
          rows={4}
          placeholder="Tell us about your team, locations, or specific challenges..."
          {...describe("message")}
        />
        <FieldError id="demo-message-error" message={fieldErrors.message} />
      </div>

      <Turnstile onSuccess={setTurnstileToken} />

      <p role="alert" aria-atomic="true" className="sr-only">
        {error ??
          [workforceError, ...Object.values(fieldErrors)]
            .filter(Boolean)
            .join(" ")}
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <Loader2 className="animate-spin" />
        ) : null}
        Request Demo <ArrowRight />
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our{" "}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms-of-service" className="underline">
          Terms of Service
        </Link>
        .
      </p>
    </form>
  );
}

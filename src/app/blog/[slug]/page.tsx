import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-6 pt-20 pb-12">
        <RevealHeading className="font-serif text-3xl">
          How Biometric Attendance Eliminates Time Theft in Kenyan Workplaces
        </RevealHeading>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 mb-8">
          <span>August 15, 2026</span>
          <span>·</span>
          <span>6 min read</span>
        </div>

        <Separator className="mb-8" />

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Time theft — staff clocking in for absent colleagues, padding timesheets, or manipulating manual registers — is estimated to cost Kenyan enterprises between 2% and 5% of total payroll annually. For a 500-person organization with an average salary of KES 85,000, that is KES 8.5m to KES 21.25m lost every year.
          </p>

          <h2 className="font-serif text-2xl mt-8 mb-4">The Three Faces of Time Theft</h2>
          <p className="text-muted-foreground mb-6">
            <strong>Buddy punching</strong> is the most visible: one staff member clocks in for another. <strong>Timesheet padding</strong> adds unworked hours to a legitimate record. <strong>Register manipulation</strong> is the oldest form — a supervisor marks an absent friend as present and both benefit.
          </p>

          <h2 className="font-serif text-2xl mt-8 mb-4">Why Manual Systems Fail</h2>
          <p className="text-muted-foreground mb-6">
            A paper register or spreadsheet is only as honest as the person holding the pen. The supervisor who approves late marks is often the same person who benefits from them. Even with the best intentions, a manual system has no audit trail, no timestamp precision, and no way to verify that the person who signed in is the person on the roster.
          </p>

          <h2 className="font-serif text-2xl mt-8 mb-4">How Biometrics Closes the Gap</h2>
          <p className="text-muted-foreground mb-6">
            A fingerprint or facial recognition terminal binds the punch to the individual. The geofence enforced by a database trigger means a punch from outside the site boundary is refused — and because the trigger runs inside Postgres, it still refuses a punch replayed later from a phone that was offline at the time. That is the difference between a UI check and a database guarantee.
          </p>

          <h2 className="font-serif text-2xl mt-8 mb-4">The ROI is Measurable</h2>
          <p className="text-muted-foreground mb-6">
            Eliminating 80% of attendance leakage on a monthly overtime spend of KES 450,000 saves KES 432,000 per year. Add the reclaimed admin time and the turnover reduction from transparent attendance records, and the case for biometric verification pays for itself in under two months.
          </p>
        </div>

        <Separator className="mt-8 mb-6" />

        <Link href="/blog" className="text-sm text-primary hover:underline">
          ← Back to all articles
        </Link>
      </article>

      <SiteFooter />
    </div>
  );
}

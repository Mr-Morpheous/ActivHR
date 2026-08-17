import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { Separator } from "@/components/ui/separator";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DemoForm } from "@/app/demo/demo-form";
import type { Metadata } from "next";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Demo",
  description:
    "Book a personalised ActivHR walkthrough scoped to your headcount, sites and statutory requirements. A specialist responds within two business hours.",
  alternates: { canonical: canonical("/demo") },
  openGraph: {
    title: "Request a Demo — ActivHR",
    description:
      "Book a personalised ActivHR walkthrough scoped to your headcount, sites and statutory requirements. A specialist responds within two business hours.",
    url: canonical("/demo"),
  },
};


export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <BlurLabel
              text="Request a Custom Demo"
              className="font-label text-primary"
            />
            <RevealHeading
              as="h1"
              delay={0.15}
              className="type-display mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
            >
              See ActivHR in action, built for{" "}
              <span className="italic text-primary sm:whitespace-nowrap">
                your organization
              </span>
            </RevealHeading>

            <p className="mt-6 max-w-xl text-muted-foreground">
              Fill out the form below and a solution specialist will reach out within 2 business hours to schedule a personalized demonstration scoped to your workforce size, locations, and compliance requirements.
            </p>
          </div>
        </section>
      </div>

      {/* Demo Request Form */}
      <section id="demo-form" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <RevealHeading className="font-serif text-3xl">
              What happens <span className="italic text-primary">next</span>?
            </RevealHeading>
            <Separator className="my-6" />
            <ol className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono">01</span>
                <span>A specialist reviews your requirements and pairs you with the right solution expert.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono">02</span>
                <span>You receive a calendar invite within 2 business hours for a 20-minute walkthrough.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono">03</span>
                <span>We walk through ActivHR configured for your org structure, headcount, and statutory requirements.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono">04</span>
                <span>No commitment required — take the insights back to your team.</span>
              </li>
            </ol>
          </div>

          <div className="p-6">
            <DemoForm />
          </div>
        </div>
      </section>

      {/* Email Follow-Up Sequence */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Demo Follow-Up <span className="italic text-primary">Sequence</span>
        </RevealHeading>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Once you submit a demo request, here&apos;s what to expect from our follow-up sequence.
        </p>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-3">
          <Reveal>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Email 1</div>
              <h3 className="font-serif text-xl mb-2">Instant Confirmation</h3>
              <p className="text-xs text-muted-foreground mb-4">Sent immediately after demo submission</p>
              <p className="text-sm text-muted-foreground">
                Subject: <span className="italic">Demo Confirmed: Modernizing your HR at [Company Name]</span>
              </p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                Thanks for reaching out! We&apos;ve received your request for a personalized ActivHR demonstration. Our team is reviewing your requirements to pair you with a solution specialist.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Email 2</div>
              <h3 className="font-serif text-xl mb-2">Value Proof & Showcase</h3>
              <p className="text-xs text-muted-foreground mb-4">Sent 24 hours later (if no response)</p>
              <p className="text-sm text-muted-foreground">
                Subject: <span className="italic">Quick question regarding [Company Name]&apos;s HR setup…</span>
              </p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                I&apos;m preparing the tailored preview of ActivHR for your organization. Many HR leaders tell us their biggest bottleneck is managing team attendance across multiple branches while ensuring 100% accurate statutory payroll compliance.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.2}>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Email 3</div>
              <h3 className="font-serif text-xl mb-2">The &ldquo;Zero Risk&rdquo; Nudge</h3>
              <p className="text-xs text-muted-foreground mb-4">Sent 3 days after initial request (if no response)</p>
              <p className="text-sm text-muted-foreground">
                Subject: <span className="italic">Re: Modernizing HR operations for [Workforce Size] employees</span>
              </p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                If you&apos;re still evaluating options, I&apos;d love to show you a quick 15-minute walkthrough of how our platform deploys in under 7 days without disrupting your daily operations.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

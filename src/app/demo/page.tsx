import { TrialRequestForm } from "./trial-request-form";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BlurLabel } from "@/components/motion/blur-label";
import { RevealHeading } from "@/components/motion/reveal-heading";

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="relative overflow-hidden">
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <BlurLabel
              text="Request Free Trial Access"
              className="font-label text-primary"
            />
            <RevealHeading
              as="h1"
              delay={0.15}
              className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
            >
              See ActivHR in action, built for{" "}
              <span className="italic text-primary sm:whitespace-nowrap">
                your organization
              </span>
            </RevealHeading>

            <p className="mt-6 max-w-xl text-muted-foreground">
              Tell us about your team and your first site. We will review your
              request and email you an access code to start your free trial.
            </p>
          </div>
        </section>
      </div>

      <section id="request-form" className="mx-auto max-w-2xl px-6 pb-16">
        <div className="rounded-md border border-border p-6">
          <TrialRequestForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

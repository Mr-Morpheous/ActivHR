import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { Separator } from "@/components/ui/separator";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BlurLabel
            text="About ActivHR"
            className="font-label text-primary"
          />
          <RevealHeading
            as="h1"
            delay={0.15}
            className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
          >
            Built for the speed of <span className="italic text-primary sm:whitespace-nowrap">African business</span>
          </RevealHeading>

          <p className="mt-6 max-w-xl text-muted-foreground">
            ActivHR was born from a simple observation: the HR tools available to African enterprises were either built for Western markets or too complex for the teams that needed them most.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Our <span className="italic text-primary">Story</span>
        </RevealHeading>
        <Separator className="mt-4 mb-8" />

        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground">
          <p>
            ActivHR was founded in Nairobi, Kenya, by a team of HR practitioners and engineers who spent years managing workforce operations across East Africa. We lived the spreadsheet chaos, the payroll discrepancies, and the compliance anxiety that our clients still face every month.
          </p>
          <p>
            Our founding team includes former HR directors from multi-site enterprises, biometric integration specialists, and regulatory compliance advisors who have guided organizations through Kenya&apos;s Data Protection Act, PAYE reforms, and multi-currency payroll requirements.
          </p>
          <p>
            Today, ActivHR serves growing teams across Nairobi, Lagos, Kampala, and Kigali — providing a mobile-first HRMIS that combines biometric attendance, automated statutory payroll, WhatsApp ESS, and strategic performance management in one platform.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Meet the <span className="italic text-primary">Team</span>
        </RevealHeading>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-3">
          <Reveal>
            <SpotlightCard className="h-full text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-serif text-3xl text-primary">AI</span>
              </div>
              <h3 className="font-serif text-xl">Amani Issa</h3>
              <p className="text-sm text-primary font-label mt-1">CTO</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Former technology delivery leader with deep expertise in biometric integrations and real-time data synchronization.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="h-full text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-serif text-3xl text-primary">WK</span>
              </div>
              <h3 className="font-serif text-xl">Wanjiku Kamau</h3>
              <p className="text-sm text-primary font-label mt-1">Head of Product</p>
              <p className="mt-3 text-sm text-muted-foreground">
                HR practitioner with 10+ years managing multi-site workforces across East Africa. Designed ActivHR&apos;s core workflows from real operational needs.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.2}>
            <SpotlightCard className="h-full text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-serif text-3xl text-primary">MO</span>
              </div>
              <h3 className="font-serif text-xl">Moses Ochieng</h3>
              <p className="text-sm text-primary font-label mt-1">Head of Compliance</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Regulatory advisor specializing in Kenya Data Protection Act, KRA statutory compliance, and multi-currency payroll frameworks.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Our <span className="italic text-primary">Mission</span>
        </RevealHeading>
        <Separator className="mt-4 mb-8" />

        <div className="max-w-3xl mx-auto">
          <blockquote className="font-serif text-2xl italic leading-relaxed text-center">
            &ldquo;To give every African enterprise — from a 20-person security firm to a 5,000-employee conglomerate — the same HR infrastructure that global headquarters take for granted. Mobile-first. Statutory-compliant on day one. Simple enough that a site supervisor can run it.&rdquo;
          </blockquote>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

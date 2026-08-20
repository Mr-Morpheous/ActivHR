import StarsBackground from "@/components/StarsBackground";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Users,
  DollarSign,
  ClipboardCheck,
  Shield,
  Globe,
  Clock,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { HeroThreads } from "@/components/site/hero-threads";
import { CtaTexture } from "@/components/site/cta-texture";
import { SiteHeader } from "@/components/site/site-header";
import { ContactForm } from "@/components/site/contact-form";
import { FAQ } from "@/components/site/faq";
import { SiteFooter } from "@/components/site/site-footer";
import { ROICalculator } from "@/components/site/roi-calculator";
import { InfoCard } from "@/components/InfoCard";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";

const PILLARS = [
  {
    icon: Users,
    group: "Core HR & Digital Onboarding",
    lead: "Centralize personnel records in a secure cloud vault. Send digital contracts and automate onboarding task checklists for new hires.",
    features: [
      ["Self-Service Onboarding", "Digital welcome packets, tax ID collection, and document uploads before Day 1"],
      ["Smart Document Vault", "Store contracts, certifications, and ID docs with automated expiration alerts"],
      ["Custom Org Charts", "Dynamically render reporting structures and department hierarchies"],
    ],
  },
  {
    icon: Clock,
    group: "Smart Attendance & Field Ops",
    lead: "Real-time clocking via biometric devices, mobile geo-fencing, or offline field sync for remote and multi-site workforces.",
    features: [
      ["Dynamic Shift Scheduling", "Create complex rosters with automatic overlap conflict detection"],
      ["Overtime Engine", "Pre-configure multipliers (1.5x, 2.0x) against statutory working hours"],
      ["Automated Leave Management", "Custom leave types with automatic balance accrual and multi-tier approvals"],
    ],
  },
  {
    icon: DollarSign,
    group: "Multi-Tax Payroll & Statutory",
    lead: "100% compliant automated payroll for local labor laws, multi-currency payouts, and instant payslip distribution via email/WhatsApp.",
    features: [
      ["Statutory Engine", "PAYE, NSSF, SHA, Housing Levy auto-computed and filed"],
      ["Multi-Currency Support", "Handle regional advisory clients across borders"],
      ["Instant Payslips", "Password-protected PDF payslips delivered via email or WhatsApp"],
    ],
  },
  {
    icon: ClipboardCheck,
    group: "Strategic Appraisal & Performance",
    lead: "Drive performance with Balanced Scorecards, Objective and Key results, 360-degree feedback, and real-time skill gap mapping.",
    features: [
      ["Multi-Framework Support", "Deploy Objective and Key results, Balanced Scorecards, or traditional KPIs"],
      ["360-Degree Feedback", "Peer-to-peer recognition, quarterly check-ins, and upward reviews"],
      ["Talent Matrix", "9-box grid to identify high-potential staff and link reviews to training"],
    ],
  },
] as const;

const PAIN_TRANSFORM = [
  {
    pain: "Spreadsheet Chaos",
    painDetail: "Fragmented employee records stored across local drives and paper files.",
    transform: "Single Source of Truth",
    transformDetail: "Centralized, encrypted cloud repository accessible anytime, anywhere.",
  },
  {
    pain: "Payroll Discrepancies",
    painDetail: "Manual overtime computations leading to costly errors and employee friction.",
    transform: "Automated Precision",
    transformDetail: "Direct biometric-to-payroll synchronization with automatic statutory deductions.",
  },
  {
    pain: "Compliance Anxiety",
    painDetail: "Missing changing local tax rates, statutory deadlines, or labor law updates.",
    transform: "Guaranteed Compliance",
    transformDetail: "Auto-updating statutory engines tailored to regional tax authorities.",
  },
  {
    pain: "Disconnected Field Teams",
    painDetail: "No visibility into remote staff, farm managers, or multi-branch retail teams.",
    transform: "Mobile-First Connectivity",
    transformDetail: "Mobile app and WhatsApp ESS (Employee Self Service) interface that works even with low bandwidth.",
  },
] as const;

const PRICING_PLANS = [
  {
    name: "STARTER",
    tagline: "Fast-Growing Teams",
    price: "KES 320",
    period: "/ employee / mo",
    features: [
      "Core HR & Document Vault",
      "Basic Leave & Attendance",
      "Standard Payslips",
      "Mobile Web Access",
      "Email Support",
    ],
    cta: "Start 14-Day Trial",
    highlighted: false,
  },
  {
    name: "GROWTH",
    tagline: "Mid-Sized Workforces",
    price: "KES 320",
    period: "/ employee / mo",
    features: [
      "Everything in Starter",
      "Biometric Integration",
      "Advanced Appraisal Engine",
      "WhatsApp ESS (Employee Self Service) Bot Access",
      "SLA Support Response",
    ],
    cta: "Schedule a Demo",
    highlighted: true,
  },
  {
    name: "ENTERPRISE",
    tagline: "Multi-Entity Groups",
    price: "Custom",
    period: "Contact Sales",
    features: [
      "Everything in Growth",
      "Custom ERP Integration",
      "Multi-Currency Payroll",
      "Dedicated Account Exec",
      "Onsite Implementation",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <HeroThreads />
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Africa&apos;s Adaptive HR and Talent Platform
            </h1>
            <h2 className="mt-5 font-label text-primary">
              HRMIS Built for the{" "}
              <span className="italic text-primary sm:whitespace-nowrap">
                Speed of African Business
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-muted-foreground">
              Automate payroll, simplify biometric and field attendance, and engage your workforce with an intuitive, mobile-first HRMIS designed for local compliance and global scale.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo">
                <Button size="lg">
                  Request a Custom Demo <ArrowRight />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Up and running in under 7 days - WhatsApp ESS (Employee Self Service) integration supported
            </p>
          </div>
        </section>
      </div>

      {/* Product Modules Deep-Dive */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Product Modules <span className="italic text-primary">Deep-Dive</span>
        </RevealHeading>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Four integrated modules covering every layer of modern HR -- from digital onboarding to strategic performance management.
        </p>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-2">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.group} delay={(i % 2) * 0.1} className="h-full flex justify-center">
                <InfoCard
                  icon={<Icon size={18} strokeWidth={1.75} />}
                  title={pillar.group}
                  description={pillar.lead}
                  features={pillar.features}
                  width={388}
                  height="auto"
                  borderColor="var(--primary)"
                  borderBgColor="var(--border)"
                  cardBgColor="var(--card)"
                  textColor="var(--card-foreground)"
                  hoverTextColor="var(--primary-foreground)"
                  effectBgColor="var(--primary)"
                  fontFamily="inherit"
                />
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Pain vs Transformation Matrix */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl">The <span className="italic text-primary">Legacy HR Nightmare</span> vs The ActivHR <span className="italic text-primary">Transformation</span></h2>
        <Separator className="mt-4 mb-10" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-destructive font-label text-sm">The Legacy HR Nightmare</TableHead>
              <TableHead className="text-primary font-label text-sm">The ActivHR Transformation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAIN_TRANSFORM.map((item) => (
              <TableRow key={item.pain}>
                <TableCell className="whitespace-normal align-top py-4">
                  <p className="font-serif text-lg">{item.pain}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.painDetail}</p>
                </TableCell>
                <TableCell className="whitespace-normal align-top py-4">
                  <p className="font-serif text-lg">{item.transform}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.transformDetail}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Pricing & Plan Architecture */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Pricing & Plan <span className="italic text-primary">Architecture</span>
        </RevealHeading>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Transparent pricing that scales with your workforce. All plans include core HR, attendance, and mobile access.
        </p>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <SpotlightCard
                className={`h-full ${plan.highlighted ? "border-primary ring-1 ring-primary/30" : ""}`}
              >
                <div className="text-center">
                  <h3 className="font-label text-primary">{plan.name}</h3>
                  <p className="mt-2 min-h-10 text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>
                  <div className="mt-4 flex items-baseline justify-center gap-1.5">
                    <span className="font-serif text-4xl leading-none">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link href="/login?mode=sign-up" className="block">
                    <Button size="lg" className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust, Security & Regional Compliance */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Trust, Security & <span className="italic text-primary">Regional Compliance</span>
        </RevealHeading>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-3">
          <Reveal>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="size-6 text-primary" strokeWidth={1.5} />
                <h3 className="font-label text-primary">Enterprise Security</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AES-256 bit encryption at rest</li>
                <li>TLS 1.3 in transit</li>
                <li>Role-based access permissions</li>
                <li>ISO 27001 aligned</li>
              </ul>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="size-6 text-primary" strokeWidth={1.5} />
                <h3 className="font-label text-primary">Statutory Compliance</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>PAYE - NSSF - SHA - Housing Levy</li>
                <li>Auto-updating with KRA rate revisions</li>
                <li>Kenya Data Protection Act 2019</li>
                <li>GDPR guidelines followed</li>
              </ul>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.2}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardCheck className="size-6 text-primary" strokeWidth={1.5} />
                <h3 className="font-label text-primary">Audit & Monitoring</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Immutable time-stamped logs</li>
                <li>Complete visibility into data modifications</li>
                <li>Payroll run audit trails</li>
                <li>Access event logging</li>
              </ul>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      <ROICalculator />

      <FAQ />

      {/* CTA band */}
      

      {/* Contact */}
      <section id="contact">
        <StarsBackground className="w-full">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="p-6">
                <div>
                  <BlurLabel text="Get in touch" className="font-label text-primary" />
                  <RevealHeading className="mt-4 font-serif text-3xl">
                    Tell us about your <span className="italic text-primary">sites</span>.
                  </RevealHeading>
                  <p className="mt-4 max-w-sm text-muted-foreground">
                    Share a bit about your team and we will set up a pilot on your own sites -- no long procurement process, no hardware purchase required to start.
                  </p>
                  <Separator className="my-6" />
                  <dl className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="font-label text-muted-foreground">Response time</dt>
                      <dd>Within 1 business day</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-label text-muted-foreground">Coverage</dt>
                      <dd>Nairobi &amp; nationwide</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-label text-muted-foreground">Phone</dt>
                      <dd><a href="tel:+254700000000" className="hover:text-primary transition-colors">+254 700 000 000</a></dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-label text-muted-foreground">Hours</dt>
                      <dd>Mon-Fri, 8:00 AM - 6:00 PM EAT</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-label text-muted-foreground">Email</dt>
                      <dd>info@activhr.africa</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </StarsBackground>
      </section>

      <SiteFooter />
    </div>
  );
}
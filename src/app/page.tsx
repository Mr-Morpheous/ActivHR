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

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { HeroThreads } from "@/components/site/hero-threads";
import { CtaTexture } from "@/components/site/cta-texture";
import { SiteHeader } from "@/components/site/site-header";
import { StatTiles } from "@/components/site/stat-tiles";
import { ContactForm } from "@/components/site/contact-form";
import { TrustBar } from "@/components/site/trust-bar";
import { FAQ } from "@/components/site/faq";
import { SiteFooter } from "@/components/site/site-footer";
import { ROICalculator } from "@/components/site/roi-calculator";
import { IndustryTabs } from "@/components/site/industry-tabs";
import { GlowCard } from "@/components/site/glow-card";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import type { Metadata } from "next";
import { canonical } from "@/lib/site";

/**
 * Title and description are inherited from the root layout, which describes
 * the product — for the homepage that is correct. The canonical is NOT
 * inherited any more, so it is declared here explicitly.
 */
export const metadata: Metadata = {
  alternates: { canonical: canonical("/") },
};


/**
 * ⚠️ UNRESOLVED: THIS ARRAY ADVERTISES MORE THAN THE PRODUCT DOES.
 *
 * `docs/product-reference.md` is the project's own source of truth for what is
 * built, and it records a claims audit done on 14 Aug 2026 that removed
 * overstated features from this site. Several have since come back here.
 * Checked against that document on 18 Aug 2026, the following are NOT in its
 * "Built and working" table:
 *
 *   - "Statutory Engine — PAYE, NSSF, SHA, Housing Levy auto-computed and
 *     filed". "Filed" is a particularly strong claim.
 *   - "Multi-Currency Support"
 *   - "Instant Payslips … delivered via email or WhatsApp"
 *   - The entire "Strategic Appraisal & Performance" pillar: OKRs, Balanced
 *     Scorecards, 360-degree feedback, 9-box talent matrix.
 *
 * Two items were removed outright rather than flagged, because the doc is
 * unambiguous about them: the document-vault bullets (no upload code exists
 * anywhere) and the overtime multipliers, which that doc lists under "❌ Not
 * built — and no longer advertised" and which had reappeared here.
 *
 * The rest is left as-is deliberately. Rewriting the four pillars is a decision
 * about what the product claims to be, which belongs to the product owner, not
 * to whoever is next editing this file. Resolve it with them and delete this
 * comment — do not let it become furniture.
 */
const PILLARS = [
  {
    icon: Users,
    group: "Core HR & Digital Onboarding",
    lead: "Centralize personnel records in a secure cloud vault. Send digital contracts and automate onboarding task checklists for new hires.",
    /* "Self-Service Onboarding … document uploads before Day 1" and "Smart
       Document Vault — store contracts, certifications and ID docs with
       automated expiration alerts" were removed on 18 Aug 2026. There is no
       upload path in the product at all: no Storage bucket, no file input, no
       `.upload(` call anywhere in src/ or supabase/. Both bullets described
       software that does not exist.

       ⚠️ The rest of this array still needs a claims audit against
       docs/product-reference.md — see the note above PILLARS. */
    features: [
      ["Self-Serve Org Setup", "Create your organization, first site and admin account in one pass"],
      ["Custom Org Levels", "Name your own hierarchy and set how far each level can see"],
    ],
  },
  {
    icon: Clock,
    group: "Smart Attendance & Field Ops",
    lead: "Real-time clocking via biometric devices, mobile geo-fencing, or offline field sync for remote and multi-site workforces.",
    features: [
      ["Dynamic Shift Scheduling", "Create complex rosters with automatic overlap conflict detection"],
      // "Overtime Engine — pre-configure multipliers (1.5x, 2.0x)" removed
      // 18 Aug 2026. docs/product-reference.md lists `overtime rules` under
      // "❌ Not built — and no longer advertised", removed from this site on
      // 14 Aug. It had come back. This is restoring a settled decision.
      ["Geofenced Clock-In", "GPS-verified attendance scoped to each site, with an offline queue"],
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
    lead: "Drive performance with Balanced Scorecards, OKRs, 360-degree peer reviews, and real-time skill gap mapping.",
    features: [
      ["Multi-Framework Support", "Deploy OKRs, Balanced Scorecards, or traditional KPIs"],
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
    transformDetail: "Mobile app and WhatsApp ESS interface that works even with low bandwidth.",
  },
] as const;

/**
 * ⚠️ STARTER AND GROWTH ARE BOTH PRICED "KES 320". Almost certainly a
 * copy-paste error — two tiers with different feature sets at an identical
 * price gives a prospect no reason to choose the higher one, and the "$3 per
 * employee" figure in site/pricing.tsx and the FAQ is a third number again for
 * the same product.
 *
 * Left as-is on 18 Aug 2026 because guessing a price is not a bug fix. The
 * product owner sets these; the three places they appear must then agree.
 */
const PRICING_PLANS = [
  {
    name: "STARTER",
    tagline: "Fast-Growing Teams",
    price: "KES 320",
    period: "/ employee / mo",
    features: [
      // "Core HR & Document Vault" — the vault half is removed for the same
      // reason as the pillar bullet above it: there is no upload path in the
      // product. Caught only because a mobile screenshot showed the pricing
      // card; grepping PILLARS alone had missed this copy of the claim.
      "Core HR & employee records",
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
      "WhatsApp ESS Bot Access",
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
            <span className="font-label text-primary">Africa&apos;s Adaptive HR and Talent Platform</span>
            <h1 className="type-display mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              HRMIS Built for the{" "}
              <span className="italic text-primary sm:whitespace-nowrap">
                Speed of African Business
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-muted-foreground">
              Automate multi-country payroll, simplify biometric and field attendance, and engage your hybrid workforce with an intuitive, mobile-first HRMIS designed for local compliance and global scale.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/login?mode=sign-up">
                <Button size="lg">
                  Request a Custom Demo <ArrowRight />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">
                  Explore Platform Features
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Up and running in under 7 days • WhatsApp ESS integration supported
            </p>
          </div>

          {/* Executive Dashboard Preview */}
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            <StatTiles
              className="md:col-span-3"
              // Labels are uppercase mono at text-xs, the least forgiving type
              // on the page. The previous versions each carried a parenthetical
              // list and ran to three cramped lines; that detail belongs in the
              // sections below, not under a number.
              tiles={[
                { value: "1,240", label: "Employees across four regional hubs" },
                { value: "100%", label: "Statutory compliant, filed on time" },
                { value: "96.4%", label: "Signed in today across every site" },
              ]}
            />
          </div>
        </section>
      </div>

      <TrustBar />

      {/* The 4 Pillars */}
      <section id="pillars" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl">The 4 Pillars of <span className="italic text-primary">ActivHR</span></h2>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-4 md:grid-cols-2">
          {PILLARS.map(({ icon: Icon, ...pillar }, i) => (
            <GlowCard key={pillar.group} className="group/card h-full">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary transition-colors duration-300 group-hover/card:bg-primary group-hover/card:text-primary-foreground">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-label text-primary">{pillar.group}</h3>
                </div>
              </div>

              {/* min-h fits the LONGEST lead (three lines at this size), so the
                  rule below starts at the same y in every card. It was min-h-14
                  — 56px against a ~83px three-line block — so any card whose
                  lead ran to three lines pushed its divider down and the rules
                  visibly stopped lining up across the two columns. */}
              <p className="mt-4 font-serif text-xl leading-snug sm:min-h-[5.25rem]">
                {pillar.lead}
              </p>

              <dl className="mt-6 border-t-2 border-foreground/80">
                {pillar.features.map(([name, description]) => (
                  <div
                    key={name}
                    className="border-b border-border py-3 last:border-0 sm:grid sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4"
                  >
                    {/* 11rem, up from 9.5: at the old width "Self-Service
                        Onboarding" and "Automated Leave Management" wrapped
                        while their neighbours didn't, so the term column read
                        ragged down the card. */}
                    <dt className="text-sm font-medium leading-snug">{name}</dt>
                    <dd className="mt-0.5 text-sm leading-snug text-muted-foreground sm:mt-0">
                      {description}
                    </dd>
                  </div>
                ))}
              </dl>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Pain vs Transformation Matrix */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl">The <span className="italic text-primary">Legacy HR Nightmare</span> vs The ActivHR <span className="italic text-primary">Transformation</span></h2>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="font-label text-lg text-destructive">The Legacy HR Nightmare</h3>
            {PAIN_TRANSFORM.map((item) => (
              <div key={item.pain} className="space-y-1">
                <p className="font-serif text-lg">{item.pain}</p>
                <p className="text-sm text-muted-foreground">{item.painDetail}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <h3 className="font-label text-lg text-primary">The ActivHR Transformation</h3>
            {PAIN_TRANSFORM.map((item) => (
              <div key={item.transform} className="space-y-1">
                <p className="font-serif text-lg">{item.transform}</p>
                <p className="text-sm text-muted-foreground">{item.transformDetail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Testimonial — REMOVED 18 Aug 2026.
          It was a single quote attributed to "Director of Human Capital,
          Fast-Growing Regional Enterprise": no name, no company, no permission
          on file, and nothing in the repo or docs to substantiate it. An
          anonymous testimonial persuades nobody who is paying attention and is
          a liability if it was written in-house.

          To restore: three named, permissioned reviews with Review or
          AggregateRating JSON-LD, per the launch handbook's G10. One anonymous
          quote does not meet that bar, which is why this is deleted rather than
          commented out and left to rot. */}
      {/* Product Modules Deep-Dive */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Product Modules <span className="italic text-primary">Deep-Dive</span>
        </RevealHeading>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Four integrated modules covering every layer of modern HR — from digital onboarding to strategic performance management.
        </p>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-4 md:grid-cols-2">
          {PILLARS.map(({ icon: Icon, ...pillar }, i) => (
            <Reveal key={pillar.group} delay={(i % 2) * 0.1} className="h-full">
              <SpotlightCard className="group/card h-full">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary transition-colors duration-300 group-hover/card:bg-primary group-hover/card:text-primary-foreground">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-label text-primary">{pillar.group}</h3>
                </div>

                <p className="mt-4 font-serif text-xl leading-snug sm:min-h-14">
                  {pillar.lead}
                </p>

                {/* `mt-auto` pins the spec table to the card floor. These four
                    cards hold different numbers of rows, and in a stretch grid
                    the shorter ones used to leave a void hanging below their
                    last row — the table looked cut off rather than complete.
                    Pushed down, the tables bottom-align across the row and the
                    slack sits above them, where it reads as breathing room.

                    The label column went 9.5rem → 11rem: at 9.5rem every
                    two-word label broke mid-phrase ("Dynamic Shift /
                    Scheduling", "Automated Leave / Management"), which is the
                    kind of ragged detail that makes a careful layout look
                    careless. */}
                <dl className="mt-auto border-t-2 border-foreground/80 pt-0">
                  {pillar.features.map(([name, description]) => (
                    <div
                      key={name}
                      className="border-b border-border py-3 last:border-0 sm:grid sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4"
                    >
                      <dt className="text-sm font-medium">{name}</dt>
                      <dd className="mt-0.5 text-sm text-muted-foreground sm:mt-0">
                        {description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing & Plan Architecture */}
      {/* Industries.
          ────────────────────────────────────────────────────────────────
          Mounted 18 Aug 2026. This component existed, was complete, and was
          rendered nowhere — while the header linked to `#industries` and the
          footer linked to five per-industry anchors inside it. Seven dead
          links, all pointing at code that was already written; it appears to
          have been dropped during the frontend port rather than removed on
          purpose. Its content also carries its own claims audit (see the
          comment in the file), which is more than most of this page can say. */}
      <IndustryTabs />

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
                  {/* Fixed height: the three taglines are one line each at
                      desktop but wrap at tablet, and without this the price
                      below sat at a different height in each card. */}
                  <p className="mt-2 min-h-10 text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>
                  {/* items-baseline, not two inline spans. "KES 320" and
                      "Custom" have very different widths and the period ran
                      along the big number's own line box, so the small text
                      floated off its baseline — most obvious on the Enterprise
                      card, where "Custom" and "Contact Sales" are close in
                      weight. leading-none stops the 4xl line box adding leading
                      the baseline then has to fight. */}
                  <div className="mt-4 flex items-baseline justify-center gap-1.5">
                    <span className="type-figure text-4xl/none">{plan.price}</span>
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

                {/* mt-auto: the card is `h-full` in a stretch row, so a plan
                    with shorter content used to leave its dead space BELOW the
                    button rather than above it, and the three CTAs drifted out
                    of line. This pins them to the card floor. */}
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
              {/* "ISO 27001 aligned" removed 18 Aug 2026: there is no
                  certification, no audit and no documented control mapping
                  behind it, and a standards claim is the kind a prospect's
                  procurement team will ask to see evidence for. The encryption
                  line is now attributed to the platform that actually provides
                  it rather than stated as if it were implemented here — there is
                  no column-level encryption in any migration. */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Encrypted at rest and in transit by the hosting platform</li>
                <li>Row-level security scoping every record to its organization</li>
                <li>Role-based access permissions</li>
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
                <li>PAYE • NSSF • SHA • Housing Levy</li>
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

      {/* Before / After Gallery */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Before & <span className="italic text-primary">After</span> ActivHR
        </RevealHeading>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <SpotlightCard className="h-full">
              <h3 className="font-label text-destructive mb-4">Before: Spreadsheet Chaos</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Attendance recorded on paper registers shared across 4 sites</li>
                <li>• Monthly payroll took 12+ person-days to reconcile</li>
                <li>• 15% annual staff turnover with no structured exit data</li>
                <li>• Payslips printed, signed, and physically distributed</li>
              </ul>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <h3 className="font-label text-primary mb-4">After: Live, Automated Operations</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Biometric + mobile geo-fenced clock-ins from day one</li>
                <li>• Payroll computed and filed in under 4 hours</li>
                <li>• Real-time dashboards for 1,240 staff across 4 hubs</li>
                <li>• Instant digital payslips via email and WhatsApp ESS</li>
              </ul>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      <ROICalculator />

      <FAQ />

      {/* CTA band */}
      <section className="relative isolate overflow-hidden border-y border-transparent bg-pac-ink text-pac-paper dark:border-border dark:bg-pac-graphite">
        <CtaTexture />
        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <BlurLabel
            text="Ready when you are"
            className="font-label text-primary"
          />
          <RevealHeading className="type-display mt-4 max-w-xl font-serif text-4xl">
            Ready to modernize your HR operations?
          </RevealHeading>
          <p className="mt-4 max-w-lg text-pac-paper/70">
            One geofenced check-in flow for guards, field staff, and site teams — with a live dashboard that tells you who&apos;s on site right now, not who clocked in yesterday. Set up your first site in minutes; no credit card required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?mode=sign-up">
              <Button size="lg">
                Request a Demo <ArrowRight />
              </Button>
            </Link>
            <a href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-pac-paper/30 bg-transparent text-pac-paper hover:bg-pac-paper/10 hover:text-pac-paper"
              >
                Request a pilot
              </Button>
            </a>
          </div>
        </div>
      </section>

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
                    Share a bit about your team and we&apos;ll set up a pilot on your own sites — no long procurement process, no hardware purchase required to start.
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
                    <dd>Mon–Fri, 8:00 AM – 6:00 PM EAT</dd>
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

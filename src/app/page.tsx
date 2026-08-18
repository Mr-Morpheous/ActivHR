import StarsBackground from "@/components/StarsBackground";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock,
  Globe,
  Shield,
  Users,
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
 * The four pillars — REWRITTEN 18 Aug 2026 to match what is actually built.
 *
 * Every line below maps to a row in the "✅ Built and working" table of
 * docs/product-reference.md, which is this project's source of truth. If you
 * add a row here, add it there first.
 *
 * WHAT THIS REPLACED, AND WHY IT MATTERED
 * ────────────────────────────────────────────────────────────────────────────
 * Two of the previous four pillars described software that does not exist:
 *
 *   - "Multi-Tax Payroll & Statutory" — PAYE/NSSF/SHA/Housing Levy "auto-
 *     computed and filed", multi-currency payouts, password-protected payslips
 *     over email and WhatsApp. There is no payroll engine in this codebase at
 *     all. The only money feature is ActivHR's OWN per-seat invoicing
 *     (lib/billing.ts, $3/employee/month) — that is us billing the customer,
 *     not the customer paying their staff.
 *   - "Strategic Appraisal & Performance" — OKRs, Balanced Scorecards,
 *     360-degree feedback, a 9-box talent matrix. None of it exists, and none
 *     of it is on the roadmap either (lib/roadmap.ts is overtime rules, shift
 *     swaps, photo at clock-in, biometric terminals, mobile apps).
 *
 * So half the page was selling a product nobody could buy. lib/roadmap.ts
 * already carries the note that "the landing page spent months advertising six
 * features that were never built" — this is the same failure, at pillar scale.
 *
 * The replacements are not smaller claims about the same things; they are the
 * things the product actually does well. Attendance enforcement, leave, the
 * per-org rank ladder with database-enforced visibility, and multi-site
 * reporting are a coherent product — arguably a more defensible one than a
 * payroll suite that would have to compete with incumbents.
 *
 * Deliberate honesty in the wording, not hedging:
 *   - Shift rosters say "build and remove", because editing and swaps do not
 *     exist (product-reference: "Create and delete only").
 *   - Reporting says the export is what you "hand to payroll", which is exactly
 *     what a CSV of approved hours is for. It stops short of claiming we run it.
 *   - Nothing here mentions biometric terminals: registration exists but there
 *     is no ingest endpoint, so a registered device does nothing.
 */
const PILLARS = [
  {
    icon: Clock,
    group: "Attendance & field operations",
    lead: "GPS-verified clock-in that holds up in the field, a queue that keeps working when the signal drops, and a shared kiosk for teams who don't clock in on their own phone.",
    features: [
      ["Geofenced clock-in", "Checked against each site's own centre and radius, and enforced in the database rather than the interface"],
      ["Works without signal", "Punches queue on the device and sync later, keeping the time the person actually clocked in"],
      ["Kiosk and QR check-in", "A shared tablet at the gate, for staff without a phone to clock in on"],
    ],
  },
  {
    icon: CalendarDays,
    group: "Leave & scheduling",
    lead: "Four leave types with balances that accrue on your own policy, approvals nobody can sign for themselves, and rosters built per site.",
    features: [
      ["Requests and approvals", "Managers approve within their own site, and no one can approve their own request"],
      ["Balances and accrual", "Per-type allowance, taken and remaining, accruing annually or monthly"],
      ["Shift rosters", "Build and remove shifts per site, with Kenyan public holidays already loaded"],
    ],
  },
  {
    icon: Users,
    group: "Structure & access",
    lead: "Name the rank ladder you actually use, then set how far each level can see. The limits are enforced in the database, not just hidden in the interface.",
    features: [
      ["Your own rank ladder", "Name the levels your organization uses, or start from one of four presets"],
      ["Visibility that is enforced", "Self, team, site or whole organization — applied to the data, not the screen"],
      ["Tenant isolation", "Every record scoped to its organization by row-level security, verified against the live database"],
    ],
  },
  {
    icon: BarChart3,
    group: "Oversight & reporting",
    lead: "Who is on site now, who was late, and who was absent — across every location, in a file you can hand straight to payroll.",
    features: [
      ["Reports and CSV export", "Filter by site, role or date range, then export the approved hours"],
      ["Multi-site management", "Each site carries its own geofence centre and radius"],
      ["Targeted notices", "Send a notice to a site, a role, or both"],
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
  // Rewritten 18 Aug 2026 alongside PILLARS. Two of these described a payroll
  // engine and a statutory filing engine, neither of which exists, and a third
  // promised a native mobile app — product-reference.md is explicit that the
  // Expo build is a development client and the honest phrasing is "works in
  // any phone browser".
  {
    pain: "Hours nobody can verify",
    painDetail: "Paper registers and buddy punching, argued over at the end of the month.",
    transform: "Attendance you can audit",
    transformDetail: "Every punch carries a GPS fix checked against that site's radius, enforced in the database.",
  },
  {
    pain: "Leave balances in a spreadsheet",
    painDetail: "Entitlements tracked by hand, and disputed the moment someone books time off.",
    transform: "Balances that keep themselves",
    transformDetail: "Allowance, taken and remaining per leave type, accruing annually or monthly on your policy.",
  },
  {
    pain: "Disconnected field teams",
    painDetail: "No visibility into remote staff, farm managers, or multi-branch retail teams.",
    transform: "Works where the signal doesn't",
    transformDetail: "Any phone browser, with punches queued on the device and synced when the connection returns.",
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
      // Rewritten 18 Aug 2026. "Standard Payslips" went with the payroll
      // pillar — there is no payslip anywhere in the product. The remaining
      // lines are capabilities, not aspirations; support level is a commercial
      // commitment rather than a software claim, which is why it can differ by
      // tier when the software does not.
      "Core HR & employee records",
      "Geofenced and kiosk clock-in",
      "Leave requests, approvals and balances",
      "Attendance reports and CSV export",
      "Email support",
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
      // "Biometric Integration" is registration-only — product-reference.md:
      // "No ingest endpoint. A registered device does nothing." "Advanced
      // Appraisal Engine" and "WhatsApp ESS Bot Access" describe software that
      // does not exist. Replaced with the structure and multi-site features,
      // which do and which genuinely suit a larger organization.
      "Everything in Starter",
      "Your own rank ladder and visibility scopes",
      "Multi-site management with per-site geofences",
      "Notices targeted by site and role",
      "Priority support response",
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
      // "Multi-Currency Payroll" removed with the payroll pillar. "Custom ERP
      // Integration" is a services commitment rather than a shipped feature,
      // so it stays but is worded as work we do, not a product you switch on.
      "Everything in Growth",
      "Multi-entity oversight console",
      "Dedicated account manager",
      "Onsite implementation and rollout",
      "Integration work scoped with your team",
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

            {/* Was "Automate multi-country payroll, simplify biometric and
                field attendance…". There is no payroll engine in the product,
                and biometric terminals can be registered but cannot send a
                scan. The hero now leads with the thing that is genuinely good
                and genuinely built: attendance that holds up in the field. */}
            <p className="mt-6 max-w-xl text-muted-foreground">
              GPS-verified clock-in for teams working across sites, leave and
              rosters that manage themselves, and attendance records you can
              export the moment payroll asks for them. Works in any phone
              browser, and keeps working when the signal doesn&apos;t.
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
              {/* "WhatsApp ESS integration supported" removed 18 Aug 2026:
                  WhatsApp appears nowhere in docs/product-reference.md — not
                  built, not partial, not on the roadmap. Replaced with the
                  no-install claim, which is true and is the same objection it
                  was trying to answer. */}
              No credit card required • Set up your organization in minutes • Nothing to install
            </p>
          </div>

          {/* Dashboard preview.
              ────────────────────────────────────────────────────────────
              These three figures sat directly under the hero with no framing,
              so they read as ActivHR's own company metrics — "1,240 employees
              across four regional hubs" is a claim about us, not a screenshot.
              None of it is verifiable, and one tile said "100% statutory
              compliant, filed on time", which is both a compliance guarantee
              and a claim about payroll filing that docs/product-reference.md
              does not list as built. That one is gone.

              The rest are now explicitly labelled as an example view. A number
              a visitor can tell is illustrative costs nothing; the same number
              mistaken for a fact is the problem. */}
          <div className="mt-16">
            <p className="font-label text-muted-foreground">
              Example dashboard — a 1,240-person operation
            </p>
            <StatTiles
              className="mt-4"
              // Labels are uppercase mono at text-xs, the least forgiving type
              // on the page. The previous versions each carried a parenthetical
              // list and ran to three cramped lines; that detail belongs in the
              // sections below, not under a number.
              tiles={[
                { value: "1,240", label: "Staff on the roster" },
                { value: "96.4%", label: "Signed in today across every site" },
                { value: "8", label: "Sites reporting live" },
              ]}
            />
          </div>
        </section>
      </div>

      <TrustBar />

      {/* The four pillars — OVERVIEW.
          ────────────────────────────────────────────────────────────────
          This section and "Product Modules Deep-Dive" below both mapped
          `PILLARS` and both rendered the lead AND the full feature table. The
          page said exactly the same thing twice, in two different card styles,
          across roughly 2,000px — a visitor scrolled past four cards and then
          met the identical four cards under a new heading.

          Split by job instead of deleting one: this is the index — what the
          four areas are — and the section below is the detail. That is the
          progression the two headings already implied and only one of them was
          delivering.

          The 01/02/03/04 markers are gone with it. Numbering earns its place
          when order carries information the reader needs; these are four
          parallel capability areas, not steps, and nobody does payroll after
          onboarding because the marker said 03. The icons already tell them
          apart. */}
      <section id="pillars" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="type-display font-serif text-3xl">
          The four pillars of <span className="italic text-primary">ActivHR</span>
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Four areas, one system. Each is broken down in detail further down the
          page.
        </p>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, ...pillar }) => (
            <div key={pillar.group}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <h3 className="font-label mt-4 text-primary">{pillar.group}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.lead}
              </p>
            </div>
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
          What each area actually does, in detail — from the clock-in on a
          phone at the gate to the file you hand to payroll.
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
                <h3 className="font-label text-primary">Data protection</h3>
              </div>
              {/* Was "Statutory Compliance", listing PAYE, NSSF, SHA, Housing
                  Levy and "auto-updating with KRA rate revisions" — a payroll
                  filing engine that does not exist. What this product genuinely
                  has to say about compliance is about personal data, which is
                  what an HR system holds. */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Built against the Kenya Data Protection Act 2019</li>
                <li>Consent captured before any non-essential cookie is set</li>
                <li>Your organization&apos;s data is never shared between tenants</li>
                <li>Attendance and leave records exportable on request</li>
              </ul>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.2}>
            <SpotlightCard className="h-full">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardCheck className="size-6 text-primary" strokeWidth={1.5} />
                <h3 className="font-label text-primary">Record integrity</h3>
              </div>
              {/* Was "Audit & Monitoring": immutable logs, complete visibility
                  into modifications, payroll run audit trails, access event
                  logging. product-reference.md lists "tamper-evident audit
                  trail" under NOT BUILT, and there is no payroll to audit.
                  These four are the integrity guarantees that do exist, all
                  enforced in the database rather than the interface. */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Punches stamped with the time taken, not the time synced</li>
                <li>Geofence checked on every write path, including offline replays</li>
                <li>Duplicate punches rejected by client event ID</li>
                <li>Nobody can approve their own leave request</li>
              </ul>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* Before / After — REMOVED 18 Aug 2026.
          ────────────────────────────────────────────────────────────────
          It read as a customer case study — "12+ person-days to reconcile",
          "15% annual staff turnover", "real-time dashboards for 1,240 staff
          across 4 hubs" — with no customer named and nothing to substantiate
          any of it. Half the "after" column described software that does not
          exist: payroll computed and filed in under four hours, instant digital
          payslips over email and WhatsApp, biometric clock-ins from day one
          (registration exists; no terminal can send a scan).

          It was also the third telling of the same story. The pain/transform
          section above already runs before → after, honestly, on features that
          ship. This one added a fabricated customer to it.

          To bring it back it needs a real, named, permissioned customer with
          figures they agree to publish — the launch handbook's C11. */}

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

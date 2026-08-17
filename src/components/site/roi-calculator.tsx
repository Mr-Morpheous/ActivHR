"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useTransform } from "motion/react";

import { useSpringNumber } from "@/lib/use-spring-number";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";

const COST_PER_USER_MONTHLY = 320; // KES
const AVG_HR_ADMIN_SALARY = 120000; // KES

function formatCurrency(amount: number) {
  return "KES " + Math.round(amount).toLocaleString();
}

export function ROICalculator() {
  const [headcount, setHeadcount] = React.useState(250);
  const [salary, setSalary] = React.useState(85000);
  const [hrAdmins, setHrAdmins] = React.useState(3);
  const [overtime, setOvertime] = React.useState(450000);
  const [turnover, setTurnover] = React.useState(15);

  const E = headcount;
  const S_avg = salary;
  const H = hrAdmins;
  const OT_total = overtime;
  const T_rate = turnover / 100;

  const adminSavingsMonthly = (H * AVG_HR_ADMIN_SALARY * 0.40) * 0.65;
  const attendSavingsMonthly = (OT_total * 0.05) * 0.80;
  const turnoverSavingsMonthly = ((E * T_rate) * (3 * S_avg) * 0.15) / 12;

  const totalMonthlySavings = adminSavingsMonthly + attendSavingsMonthly + turnoverSavingsMonthly;
  const totalAnnualSavings = totalMonthlySavings * 12;

  const monthlyCost = E * COST_PER_USER_MONTHLY;
  const annualCost = monthlyCost * 12;
  const netAnnualSavings = totalAnnualSavings - annualCost;
  const roiPercentage = annualCost > 0 ? (netAnnualSavings / annualCost) * 100 : 0;
  const paybackDays = totalMonthlySavings > 0 ? (monthlyCost / totalMonthlySavings) * 30 : 0;
  const annualHoursSaved = H * 160 * 0.40 * 0.65 * 12;

  const adminPct = totalMonthlySavings > 0 ? (adminSavingsMonthly / totalMonthlySavings) * 100 : 33;
  const attendPct = totalMonthlySavings > 0 ? (attendSavingsMonthly / totalMonthlySavings) * 100 : 33;
  const turnoverPct = totalMonthlySavings > 0 ? (turnoverSavingsMonthly / totalMonthlySavings) * 100 : 34;

  // Three steps of the brand blue, strongest first, so the series read as one
  // system rather than as three unrelated hues. `mix` is the percentage of
  // `--primary` in each step, shared by the bar and its legend so the two
  // can't drift apart.
  //
  // The steps are mixed toward `--foreground`, not toward `transparent`. The
  // transparent version was the obvious first attempt and it failed a look at
  // the rendered page: on the ink theme the weakest step at 32% opacity was
  // indistinguishable from the track behind it, and its legend dot had all but
  // vanished. Mixing toward the foreground varies *lightness* instead of
  // opacity, which stays legible against the track on both themes — paler
  // blue on ink, deeper blue on paper.
  const composition = [
    { label: "Admin Time", value: adminPct, mix: 100 },
    { label: "Attendance", value: attendPct, mix: 55 },
    { label: "Turnover", value: turnoverPct, mix: 25 },
  ];

  return (
    <section id="roi-calculator" className="mx-auto max-w-6xl px-6 py-16">
      <RevealHeading className="font-serif text-3xl">
        ActivHR ROI & <span className="italic text-primary">Savings Calculator</span>
      </RevealHeading>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Quantify the cost savings ActivHR can deliver across administrative labor, attendance leakage, and employee turnover.
      </p>
      <Separator className="mt-4 mb-10" />

      <Reveal>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Controls */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl">Calculate Your ROI</h3>

            <RangeField
              id="roi-headcount"
              label="Employee Headcount"
              hint="Total number of employees in your organization across all sites"
              min={10}
              max={2000}
              step={10}
              value={headcount}
              onChange={setHeadcount}
              display={headcount.toLocaleString()}
            />

            <NumberField
              id="roi-salary"
              label="Avg Monthly Salary per Staff (KES)"
              step={5000}
              value={salary}
              onChange={setSalary}
            />

            <RangeField
              id="roi-hr-admins"
              label="HR Administrators"
              min={1}
              max={20}
              step={1}
              value={hrAdmins}
              onChange={setHrAdmins}
              display={String(hrAdmins)}
            />

            <NumberField
              id="roi-overtime"
              label="Monthly Overtime / Field Spend (KES)"
              step={10000}
              value={overtime}
              onChange={setOvertime}
            />

            <RangeField
              id="roi-turnover"
              label="Annual Staff Turnover Rate"
              min={5}
              max={40}
              step={1}
              value={turnover}
              onChange={setTurnover}
              // `turnover` is the whole number the slider actually holds.
              // This printed `T_rate * 100` — a round trip through the
              // fraction — which is not lossless in binary floating point:
              // 4 of the 36 reachable positions rendered as 7.000000000000001,
              // 14.000000000000002, 28.000000000000004 and 28.999999999999996.
              display={`${turnover}%`}
            />
          </div>

          {/* Results Panel */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="rounded-lg bg-primary p-6 text-center text-primary-foreground mb-6">
              <div className="text-sm uppercase tracking-wider opacity-90">Estimated Annual Cost Savings</div>
              {/* `tabular-nums` is load-bearing here, not typographic
                  preference: these five figures recompute on every
                  `input` event while a slider is being dragged, and with
                  proportional digits each recompute changes the string's
                  width, so the number juddered and reflowed under the
                  finger. The rest of the site's large figures already use
                  this treatment (see site/stat-tiles.tsx). */}
              <SpringFigure
                className="type-figure mt-2 text-4xl/none"
                value={totalAnnualSavings}
                format={formatCurrency}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Net Annual ROI</div>
                <SpringFigure
                  className="type-figure mt-1 text-2xl/none"
                  value={roiPercentage}
                  format={(v) => `${Math.round(v)}%`}
                />
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Payback Period</div>
                <SpringFigure
                  className="type-figure mt-1 text-2xl/none"
                  value={paybackDays}
                  format={(v) => `${Math.ceil(v)} Days`}
                />
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">HR Hours Saved/Yr</div>
                <SpringFigure
                  className="type-figure mt-1 text-2xl/none"
                  value={annualHoursSaved}
                  format={(v) => `${Math.round(v).toLocaleString()} Hrs`}
                />
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Est. Software Cost/Yr</div>
                <SpringFigure
                  className="type-figure mt-1 text-2xl/none"
                  value={annualCost}
                  format={formatCurrency}
                />
              </div>
            </div>

            {/* Composition bar.
                ────────────────────────────────────────────────────────────
                Was `bg-blue-500 / bg-green-500 / bg-orange-500` — the only
                raw palette values in the site layer. They didn't re-theme
                between ink and paper, and orange is specifically the colour
                the brand moved away from. Three steps of `--primary` via
                `color-mix` follow the light/dark toggle for free, the same
                way the bento glow does.

                Segments are placed with `translateX` + `scaleX` instead of
                `width`, because these values change on every `input` event
                while a slider is dragged and `width` would mean a layout
                pass per frame. */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-3">Savings Composition</div>
              <div className="relative h-3 w-full overflow-hidden rounded-sm bg-secondary">
                {composition.map((segment, i) => {
                  const offset = composition
                    .slice(0, i)
                    .reduce((sum, s) => sum + s.value, 0);
                  return (
                    <div
                      key={segment.label}
                      className="pac-bar-segment absolute inset-y-0 left-0 w-full origin-left"
                      style={{
                        background: `color-mix(in srgb, var(--primary) ${segment.mix}%, var(--foreground))`,
                        transform: `translateX(${offset}%) scaleX(${segment.value / 100})`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                {composition.map((segment) => (
                  <span key={segment.label} className="flex items-center gap-1">
                    <span
                      className="inline-block size-2 rounded-full"
                      style={{
                        background: `color-mix(in srgb, var(--primary) ${segment.mix}%, var(--foreground))`,
                      }}
                    />{" "}
                    {segment.label}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/demo">
              <Button size="lg" className="w-full mt-4">
                Claim These Savings — Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * A result figure that follows its value with a spring instead of teleporting
 * to it.
 *
 * These five numbers are the output of a control the user is holding. Snapping
 * them to a new value on every `input` event tells you the number changed but
 * not by how much or in which direction; a spring makes the size of the change
 * legible, which is the entire reason someone drags the slider.
 *
 * `useSpringNumber` re-targets rather than restarting, so a continuous drag
 * produces one continuous motion — see the note in `lib/use-spring-number.ts`
 * for why `CountUp` is the wrong tool here despite already existing.
 */
function SpringFigure({
  value,
  format,
  className,
}: {
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const spring = useSpringNumber(value);
  const text = useTransform(spring, format);

  return <motion.div className={className}>{text}</motion.div>;
}

/**
 * One labelled slider.
 *
 * Two things this fixes over the inline markup it replaces:
 *
 *  - **The control has a name.** Each field was previously titled by an
 *    adjacent `<span>`, which is not associated with anything, so a screen
 *    reader announced five unnamed sliders and number boxes. These are real
 *    `<label htmlFor>` pairs.
 *  - **`--range-pct` fills the travelled portion of the track** (see
 *    `.pac-range` in globals.css). The control reports its own value during
 *    the drag instead of leaving that entirely to the figure beside it.
 *
 * `display` is passed in rather than derived so each caller controls its own
 * formatting — thousands separators, a percent sign — without this component
 * having to know which unit it is showing.
 */
function RangeField({
  id,
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  id: string;
  label: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  const labelEl = (
    <label
      htmlFor={id}
      className={
        "font-medium" +
        (hint ? " cursor-help border-b border-dashed border-muted-foreground" : "")
      }
    >
      {label}
    </label>
  );

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
        {hint ? <Tooltip text={hint}>{labelEl}</Tooltip> : labelEl}
        <span className="font-mono tabular-nums text-primary">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="pac-range"
        style={{ "--range-pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * A labelled currency field. Uses the shared `Input` primitive, which the
 * hand-rolled version here predated — so the focus ring, radius and border
 * tokens now match every other text field in the product.
 */
function NumberField({
  id,
  label,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tabular-nums"
      />
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <Tooltip text="Total number of employees in your organization across all sites">
                  <span className="font-medium cursor-help border-b border-dashed border-muted-foreground">Employee Headcount</span>
                </Tooltip>
                <span className="text-primary font-mono">{E.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={E}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Avg Monthly Salary per Staff (KES)</span>
              </div>
              <input
                type="number"
                value={S_avg}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                step="5000"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">HR Administrators</span>
                <span className="text-primary font-mono">{H}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={H}
                onChange={(e) => setHrAdmins(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Monthly Overtime / Field Spend (KES)</span>
              </div>
              <input
                type="number"
                value={OT_total}
                onChange={(e) => setOvertime(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                step="10000"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">Annual Staff Turnover Rate</span>
                <span className="text-primary font-mono">{T_rate * 100}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="rounded-lg bg-primary p-6 text-center text-primary-foreground mb-6">
              <div className="text-sm uppercase tracking-wider opacity-90">Estimated Annual Cost Savings</div>
              <div className="text-4xl font-bold mt-2">{formatCurrency(totalAnnualSavings)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Net Annual ROI</div>
                <div className="text-2xl font-bold mt-1">{Math.round(roiPercentage)}%</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Payback Period</div>
                <div className="text-2xl font-bold mt-1">{Math.ceil(paybackDays)} Days</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">HR Hours Saved/Yr</div>
                <div className="text-2xl font-bold mt-1">{Math.round(annualHoursSaved).toLocaleString()} Hrs</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Est. Software Cost/Yr</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(annualCost)}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-3">Savings Composition</div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary flex">
                <div className="bg-blue-500 h-full transition-all" style={{ width: `${adminPct}%` }} />
                <div className="bg-green-500 h-full transition-all" style={{ width: `${attendPct}%` }} />
                <div className="bg-orange-500 h-full transition-all" style={{ width: `${turnoverPct}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Admin Time</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Attendance</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Turnover</span>
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

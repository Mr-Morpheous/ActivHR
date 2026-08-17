"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { DURATION, SPRING } from "@/lib/motion";

/**
 * Each industry carries a short spec sheet rather than a screenshot slot —
 * the earlier landing page reserved a grey box per tab for an image that was
 * never produced, and an empty frame reads worse than no frame.
 *
 * CLAIMS AUDIT, 14 Aug 2026. Every entry below is a feature that exists.
 * This file previously advertised a native mobile app, biometric terminal
 * capture and overtime flagging by policy, none of which are built — and it was
 * missed by the first pass of the audit, which read the hero, the feature
 * clusters and the FAQ but not this file. A `grep` for the claim words is the
 * only reason it was caught.
 *
 * If you add a row here, it must be marked built in docs/product-reference.md.
 * "Primary capture" is what a person actually touches, so it can only be a
 * phone browser or a shared kiosk until a terminal ingest endpoint exists.
 */
const INDUSTRIES = [
  {
    id: "field-services",
    label: "Field services",
    title: "Built for teams in the field",
    features: [
      "GPS-verified clock-in for every worker",
      "Geofences scoped to each job site",
      "Offline mode that syncs when back online",
      "Real-time visibility across every site",
    ],
    spec: [
      ["Primary capture", "Phone browser"],
      ["Typical site", "Client premises, rotating"],
      ["Common exception", "Out-of-geofence check-in"],
    ],
  },
  {
    id: "security",
    label: "Security & guarding",
    title: "Built for security teams",
    features: [
      "GPS-verified clock-in at every post",
      "Geofences scoped to each site",
      "Offline mode that syncs when back online",
      "Real-time visibility across every post",
    ],
    spec: [
      ["Primary capture", "Phone browser + kiosk"],
      ["Typical site", "Fixed post, 12-hour shifts"],
      ["Common exception", "No-show at shift handover"],
    ],
  },
  {
    id: "retail",
    label: "Retail & warehousing",
    title: "Built for retail & warehouse teams",
    features: [
      "Kiosk clock-in for shared terminals",
      "Shift rosters per store or warehouse",
      "Leave balances and approvals",
      "Live dashboards across locations",
    ],
    spec: [
      ["Primary capture", "Shared kiosk / QR"],
      ["Typical site", "Store floor, split shifts"],
      ["Common exception", "Missed kiosk punch"],
    ],
  },
  {
    id: "logistics",
    label: "Logistics",
    title: "Built for logistics teams",
    features: [
      "GPS-verified clock-in for depots and routes",
      "Offline mode for low-signal areas",
      "Absent and late flagged on reports",
      "Payroll export to your provider",
    ],
    spec: [
      ["Primary capture", "Phone browser"],
      ["Typical site", "Depot start, route end"],
      ["Common exception", "Late depot departure"],
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    title: "Built for manufacturing teams",
    features: [
      "Kiosk clock-in on the shop floor",
      "Shift builder per line or site",
      "Leave types, balances and accrual",
      "Custom reports by site or role",
    ],
    spec: [
      ["Primary capture", "Shared kiosk / QR"],
      ["Typical site", "Plant floor, continuous lines"],
      ["Common exception", "Line handover gaps"],
    ],
  },
] as const;

const IDS = INDUSTRIES.map((i) => i.id) as readonly string[];

export function IndustryTabs() {
  const [active, setActive] = React.useState<string>(INDUSTRIES[0].id);
  const reduceMotion = useReducedMotion();

  // Which way the underline just travelled. The new panel enters from that
  // side, so the intermediate frames point at the outcome instead of
  // interpolating blindly to it — a person reading the trajectory can tell
  // where the content is coming from before it arrives.
  const activeIndex = INDUSTRIES.findIndex((i) => i.id === active);
  const previousIndex = React.useRef(activeIndex);
  const direction = activeIndex >= previousIndex.current ? 1 : -1;

  React.useEffect(() => {
    previousIndex.current = activeIndex;
  }, [activeIndex]);

  // Footer links deep-link straight to an industry (e.g. /#logistics). The
  // hash also matches the trigger's element id, so the browser handles the
  // scroll and this only has to select the tab.
  React.useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (IDS.includes(id)) setActive(id);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <section id="industries" className="mx-auto max-w-6xl px-6 py-16">
      <RevealHeading className="font-display text-3xl">
        Built for how your industry works
      </RevealHeading>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Same product; the shift patterns and the exceptions differ.
      </p>
      <Separator className="mt-4 mb-8" />

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="h-auto flex-wrap">
          {INDUSTRIES.map((industry) => (
            <TabsTrigger
              key={industry.id}
              value={industry.id}
              // The shared Tabs primitive draws the active state as a static
              // bottom border. Suppressed here so a single shared underline
              // can slide between triggers instead of jumping.
              className="relative data-[state=active]:border-transparent"
            >
              {/* The hash anchor lives on this span, not on TabsTrigger.
                  Setting `id` on the trigger overwrote the one Radix
                  generates, breaking the aria-labelledby link from the
                  panel back to its tab. */}
              <span id={industry.id}>{industry.label}</span>
              {industry.id === active &&
                (reduceMotion ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                ) : (
                  <motion.span
                    layoutId="industry-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                    // Was `{ stiffness: 420, damping: 34 }` written inline —
                    // a damping ratio of ≈0.83 over a ≈0.31s response, which
                    // is almost exactly Apple's published figure for a sheet.
                    // The value was right; it just wasn't shared with anything
                    // else, so it is now the `drawer` token. Kept as-is
                    // because this is a travelling object with real distance
                    // to cover, and it is the one piece of motion on this page
                    // that already felt correct.
                    transition={SPRING.drawer}
                  />
                ))}
            </TabsTrigger>
          ))}
        </TabsList>

        {INDUSTRIES.map((industry) => (
          <TabsContent key={industry.id} value={industry.id} className="pt-6">
            {/* The underline used to glide between triggers while the panel
                underneath it hard-cut, so the good motion drew attention to
                the missing motion. Radix unmounts the inactive panels, so
                this animates on every switch without needing AnimatePresence.

                `SPRING.ui` rather than `drawer`: a tab is clicked, not thrown,
                so there is no momentum for an overshoot to be honest about. */}
            <motion.div
              className="grid gap-10 md:grid-cols-[1.2fr_1fr]"
              // Full `transform` string, not the `x` shorthand: `opacity` is in
              // motion's hardware-accelerated set and `x` is not, so pairing
              // them runs the two halves of one entrance on different clocks —
              // WAAPI for the fade, main-thread rAF for the slide — which can
              // visibly desync under load.
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: `translateX(${direction * 12}px)` }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateX(0px)" }
              }
              transition={
                reduceMotion ? { duration: DURATION.base } : SPRING.ui
              }
            >
              <div>
                <h3 className="font-display text-2xl">{industry.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {industry.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        strokeWidth={2}
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="self-start rounded-sm border border-border bg-card">
                {industry.spec.map(([key, value], i) => (
                  <div
                    key={key}
                    className={
                      "flex items-baseline justify-between gap-4 px-5 py-3" +
                      (i > 0 ? " border-t border-border" : "")
                    }
                  >
                    <dt className="font-label text-muted-foreground">{key}</dt>
                    <dd className="text-right text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

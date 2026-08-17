"use client";

import * as React from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { SPRING_OPTIONS } from "@/lib/motion";

/**
 * Follows a number with a spring, so a figure driven by a continuous control
 * moves to its new value instead of teleporting to it.
 *
 * WHY NOT `CountUp`
 * ────────────────────────────────────────────────────────────────────────────
 * `site/stat-value.tsx` already animates numbers, and is the right tool for
 * what it does — a figure counting up once as it scrolls into view. It is the
 * wrong tool here. A slider emits an `input` event per pixel of travel, and a
 * duration-based count-up would restart from scratch on each one, so the
 * number would stutter backwards for as long as the drag lasted.
 *
 * A spring has no fixed duration and no notion of starting over. Re-targeting
 * it mid-flight is the normal case, not an interruption: it carries its
 * current position and velocity into the new target, which is exactly the
 * behaviour a value being dragged needs.
 *
 * Returns a `MotionValue<number>`. Render it through `useTransform` to format
 * it, inside a `motion.*` element:
 *
 * ```tsx
 * const savings = useSpringNumber(total);
 * const text = useTransform(savings, (v) => formatCurrency(v));
 * return <motion.div>{text}</motion.div>;
 * ```
 */
export function useSpringNumber(value: number) {
  const reduceMotion = useReducedMotion();

  // The spring tracks a *source* motion value rather than being `.set()`
  // directly. Both spellings appear in the docs, but only this one reliably
  // re-targets: passing a plain number to `useSpring` makes it the initial
  // value, and a later `.set()` on the returned value was landing instantly
  // here — verified in the browser, where the figure jumped rather than
  // travelled. Driving it from a source is unambiguous: every change to the
  // source is something for the spring to chase.
  const source = useMotionValue(value);
  const spring = useSpring(source, SPRING_OPTIONS.ui);

  React.useEffect(() => {
    source.set(value);
  }, [source, value]);

  // Reduced motion gets the source itself — still live, still correct, just
  // not travelling. Returning a different value is safe because both hooks
  // above always run.
  return reduceMotion ? source : spring;
}

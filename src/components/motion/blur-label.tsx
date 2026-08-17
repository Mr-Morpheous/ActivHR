"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import BlurText from "@/components/reactbits/BlurText";
import { DURATION } from "@/lib/motion";

/**
 * Word-by-word blur reveal for a short plain-string label (the mono
 * eyebrows above section headings). Safe to split per word here because,
 * unlike the headings, these carry no inline markup.
 *
 * BlurText renders a flex-wrap <p>; under reduced motion this falls back to
 * a plain <p> with the same classes so layout doesn't shift.
 *
 * **The fallback is gated on mount, not applied during render.** BlurText
 * splits the string into one span per word, and the plain fallback is a single
 * text node — so branching on `useReducedMotion()` during render means the
 * server emits one structure and a reduced-motion client's first render emits
 * another. That is React hydration error #418, and it was live on the landing
 * page until the 10 Aug browser pass emulated `prefers-reduced-motion` for the
 * first time. Keeping the first client render identical to the server's, and
 * swapping afterwards, is what fixes it.
 */
export function BlurLabel({
  text,
  className,
  delay = 60,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (mounted && reduceMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <BlurText
      text={text}
      className={className}
      delay={delay}
      animateBy="words"
      direction="bottom"
      // BlurText animates each word through 3 keyframe snapshots, so a word's
      // own reveal takes `stepDuration × 2` — this is a 0.4s reveal, not a 0.2s
      // state change, and calling it `DURATION.base` mislabelled it by half.
      // Expressed as a third of `reveal` because that is what it is: a share of
      // one reveal, spent per snapshot. (Was 0.3s, chosen in isolation.)
      stepDuration={DURATION.reveal / 3}
    />
  );
}

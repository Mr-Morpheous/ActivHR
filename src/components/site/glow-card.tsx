"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import BorderGlow from "@/components/reactbits/BorderGlow";
import { cn } from "@/lib/utils";

/**
 * DS-01 wrapper around React Bits' BorderGlow.
 *
 * The vendored component draws a mesh-gradient border that tracks the cursor
 * and brightens as it nears an edge. Three things it does not do, which is
 * what this wrapper is for — the same pattern `ui/spotlight-card.tsx` and
 * `motion/bento.tsx` already follow:
 *
 *  1. **It ignores `prefers-reduced-motion`.** No React Bits component
 *     honours it. Under reduced motion this renders a plain bordered card
 *     with no listeners at all.
 *  2. **Its defaults are dark-only and large-radius** — `#120F17` and a 28px
 *     radius, against a system whose radius is `0.2rem` and which has to work
 *     on paper as well as ink. Both are props, so they are fed the real
 *     tokens here.
 *  3. **Its glow colour is a raw HSL triplet**, so it cannot read
 *     `--primary`. Blue-500 is passed as `217 91 60`. THIS IS THE SECOND
 *     PLACE A BRAND COLOUR IS DUPLICATED AS A NUMBER (the first is
 *     `hero-threads.tsx`, which needs a WebGL `vec3`). If the primary blue
 *     changes, change it here too.
 *
 * One thing the wrapper deliberately does NOT try to fix: the component
 * hardcodes `border border-white/15` into its own class string and
 * concatenates the caller's `className` after it rather than merging, so a
 * conflicting border utility is resolved by CSS source order, not by intent.
 * That is the flaw doc 13 records for `PixelCard` — the reason that one was
 * rewritten rather than wrapped. It is tolerable here because a 15% white
 * hairline reads correctly on the ink field this is used on, and because the
 * plain branch below is the one that has to work on paper.
 *
 * **The plain branch is the common case, not the fallback.** It serves every
 * touch device, every reduced-motion visitor and the server render. The glow
 * is progressive enhancement for a pointer, which is the only input that can
 * perceive it.
 */
export function GlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  // Gated on mount, like every other motion wrapper here. `BorderGlow` and a
  // plain div do not emit the same markup, so choosing between them during
  // render from a browser-only value is React hydration error #418 — the bug
  // doc 13 found live in five components at once. See doc 13.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // No cursor, no glow.
  //
  // The whole effect is driven by pointer position, so on a touch device it
  // renders a static border and then spends the rest of its life doing
  // nothing — while still mounting listeners, running its rAF loop and
  // carrying six stacked mask layers per card, four cards to a page. That is
  // pure cost on exactly the hardware least able to absorb it, and mobile
  // performance is a stated requirement. `(pointer: fine)` is the honest
  // test: a mouse or trackpad, not a screen width, which a phone in
  // landscape would get wrong.
  const [hasPointer, setHasPointer] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setHasPointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasPointer(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mirrors `ui/card.tsx`'s shell exactly, so CardHeader / CardContent and the
  // existing pillar markup lay out identically inside either branch.
  const shell = "bg-card text-card-foreground flex flex-col gap-4 p-5";

  if (!mounted || reduceMotion || !hasPointer) {
    return (
      <div className={cn(shell, "rounded-sm border border-border", className)}>
        {children}
      </div>
    );
  }

  return (
    <BorderGlow
      backgroundColor="var(--card)"
      borderRadius={3}
      glowColor="217 91 60"
      glowRadius={28}
      glowIntensity={0.85}
      fillOpacity={0.35}
      className={cn(shell, className)}
    >
      {children}
    </BorderGlow>
  );
}

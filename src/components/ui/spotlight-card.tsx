"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DS-01 adaptation of React Bits' SpotlightCard.
 *
 * The vendored original hardcodes `rounded-3xl border-neutral-800
 * bg-neutral-900 p-8` and a white spotlight — a dark-only card with a
 * 24px radius, against a system whose radius is 0.2rem and which has to
 * work on paper as well as ink. This keeps the pointer-tracking behaviour
 * and rebuilds the surface on card tokens, with the spotlight in brand
 * orange at an opacity that reads in both themes.
 *
 * Pointer-only by nature, so it's pure decoration — the card's content and
 * focus behaviour are unaffected, and nothing here is announced.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "color-mix(in srgb, var(--primary) 22%, transparent)",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        // `px-5` — NOT in ui/card.tsx, and that difference is the point.
        //
        // This shell was copied from `Card`, which sets only `py-5` because its
        // horizontal padding lives on CardHeader / CardContent / CardFooter.
        // `Card` is never used without them. `SpotlightCard` is: all 20 usages
        // on the marketing site pass raw divs, lists and definition lists as
        // children, so nothing supplied the horizontal padding and every one of
        // them rendered its text flush against the left and right borders. That
        // is what made the cards look unfinished.
        //
        // If a caller ever nests CardHeader/CardContent in here, remove this and
        // let those provide it — but no caller does today.
        "bg-card text-card-foreground border border-border rounded-sm flex flex-col gap-4 px-5 py-5",
        // 200ms, not 300ms: this is a hover state on a card, and there are
        // seven of these on the landing page alone. Hover feedback sits in the
        // same budget as press feedback — short enough that it reads as the
        // card responding rather than as an animation playing.
        "relative overflow-hidden transition-colors duration-200 ease-out hover:border-primary/40",
        className
      )}
    >
      <div
        aria-hidden
        /* Was `duration-500 ease-in-out`. Two problems: `ease-in-out` starts
           slow, which delays the exact frame the pointer is waiting on, and
           500ms is more than double the budget for a hover response — the
           spotlight arrived after the pointer had already moved on.
           `ease-out` at 200ms tracks the pointer instead of trailing it.

           `pac-hover-only` because this is driven by `mouseenter`/`mouseleave`:
           on a touch device the first tap lit it and nothing ever turned it
           off. */
        className="pac-hover-only pointer-events-none absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:hidden"
        style={{
          opacity,
          background: `radial-gradient(circle 22rem at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

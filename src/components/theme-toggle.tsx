"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Keeps its accessible name while the icon is still unknown. `aria-hidden`
    // removed a focusable control from the tree entirely, which leaves a
    // screen-reader user tabbing onto a button that announces nothing.
    return (
      <Button variant="outline" size="icon" disabled aria-label="Toggle theme" />
    );
  }

  const isDark = resolvedTheme === "dark";

  /**
   * Eases the largest brightness change on the site instead of cutting to it.
   *
   * The page-wide cross-fade comes from a view transition, not from CSS
   * transitions — `disableTransitionOnChange` is deliberately left on in
   * layout.tsx, because transitioning every element individually is both slow
   * and visually worse than the hard cut it would replace. A view transition
   * animates one snapshot of the page, so nothing else has to change.
   *
   * `flushSync` is required: `startViewTransition` snapshots the DOM, runs the
   * callback, then snapshots again, so the theme must actually be applied
   * before the callback returns. A plain `setTheme` would be batched and land
   * after the second snapshot had already been taken, producing a cross-fade
   * between two identical frames.
   *
   * Falls through to an instant swap where view transitions aren't supported
   * or where motion is reduced — which is exactly what happened before.
   */
  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    const doc = document as ViewTransitionDocument;

    if (reduceMotion || typeof doc.startViewTransition !== "function") {
      setTheme(next);
      return;
    }

    doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  }

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? "Switch to paper" : "Switch to ink"}
      onClick={toggleTheme}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

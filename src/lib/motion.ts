/**
 * The site's motion vocabulary.
 *
 * WHY THIS FILE EXISTS
 * ────────────────────────────────────────────────────────────────────────────
 * Before it, "content entering the viewport" — one concept — was animated
 * three different ways: gsap `power3.out` over 0.6s in `motion/reveal.tsx`,
 * a cubic bézier over 0.7s in `motion/reveal-heading.tsx`, and BlurText's own
 * per-word stepping in `motion/blur-label.tsx`. Hover states picked from
 * `duration-300` and `duration-500` by hand. Meanwhile the one genuinely
 * well-chosen spring on the site was stranded as a local literal in
 * `site/industry-tabs.tsx`.
 *
 * None of those values were wrong so much as unrelated. Craft is the claim
 * that no timing is arbitrary, which requires the timings to be named
 * somewhere you can point at.
 *
 * ⚠️ THE UNITS TRAP — READ BEFORE CHANGING ANYTHING HERE
 * ────────────────────────────────────────────────────────────────────────────
 * `motion` reads a spring's `duration` in **different units on two different
 * paths**, and nothing warns you:
 *
 *   - `transition={...}` on a `motion.*` component → **seconds**. The value
 *     goes through `motion-value.mjs`, which multiplies by 1000.
 *   - `useSpring(source, {...})` → **milliseconds**. It reaches `JSAnimation`
 *     via `follow-value.mjs` with no conversion.
 *
 * This cost a real bug. `useSpring(source, { bounce: 0, duration: 0.4 })` was
 * read as 0.4ms, clamped to the 10ms floor, and the ROI figures snapped to
 * their target instead of travelling. Measured against the installed
 * motion@12.43.0 generator: `duration: 0.4` settles in 17ms; `duration: 400`
 * settles in 415ms.
 *
 * So the canonical numbers below are in seconds, and `SPRING_MS` derives the
 * millisecond form. Never hand-write a duration into `useSpring`.
 *
 * A SECOND TRAP: `duration` IS NOT A NATURAL PERIOD
 * ────────────────────────────────────────────────────────────────────────────
 * Apple describes a spring by damping ratio + *response* (its natural period).
 * motion's `duration` is the *settling* time. They are not interchangeable, and
 * converting one to the other with `stiffness = (2π/response)²` produces a
 * visibly different spring — that mistake shipped here briefly and made the
 * figures 36% slower than intended (564ms settle against 415ms).
 *
 * If you need the physics triplet, do not derive it algebraically. Measure it:
 * drive `spring({ keyframes: [0, 100], ...opts })` to `done` and compare
 * settle times. That is how `drawer` below was matched to the value it
 * replaced.
 *
 * THE TWO SPRINGS
 * ────────────────────────────────────────────────────────────────────────────
 *  - **`ui` — no overshoot.** The default. Critically damped is graceful and
 *    non-distracting; a menu that merely faded in has no business bouncing.
 *  - **`drawer` — slight overshoot.** Only for surfaces the user physically
 *    pushes or pulls. Bounce is honest only when momentum preceded it.
 *
 * `drawer` reproduces the `{ stiffness: 420, damping: 34 }` that
 * `industry-tabs.tsx` had arrived at independently and which was the one piece
 * of motion on the page that already felt right. Verified numerically: both
 * settle in 448ms.
 *
 * This module is dependency-free so server components can import the tokens.
 * The hook that consumes them lives in `use-spring-number.ts`.
 */

/** Canonical spring definitions. Durations in SECONDS — see the units trap. */
const UI_SPRING = { bounce: 0, duration: 0.4 } as const;
const DRAWER_SPRING = { bounce: 0.17, duration: 0.44 } as const;

/** Spring transitions, for the `transition` prop on a `motion.*` component. */
export const SPRING = {
  /** Default. Critically damped — reaches the target without overshooting. */
  ui: { type: "spring", ...UI_SPRING },
  /** For sheets, drawers and travelling indicators. Slight overshoot. */
  drawer: { type: "spring", ...DRAWER_SPRING },
} as const;

/**
 * The same springs with `duration` in MILLISECONDS, for `useSpring` and
 * anything else on the follow-value path. Derived, never hand-written.
 */
export const SPRING_MS = {
  ui: { bounce: UI_SPRING.bounce, duration: UI_SPRING.duration * 1000 },
  drawer: {
    bounce: DRAWER_SPRING.bounce,
    duration: DRAWER_SPRING.duration * 1000,
  },
} as const;

type Bezier = [number, number, number, number];

/**
 * The site's entry curve, for the cases a spring cannot serve: something the
 * user cannot grab mid-flight, where a fixed duration is not a limitation.
 *
 * Kept as-is — it is the brand's signature entry, and the point of moving it
 * here was to stop it being redefined per file, not to change how it moves.
 *
 * There is deliberately no `ease-in` counterpart. An ease-in curve starts slow,
 * which delays the exact frame the user is watching, so it is always wrong on
 * interface motion. Shipping one as a named token would only invite its use.
 * The CSS mirror of this curve lives in `globals.css` as `--ease-out`.
 */
export const EASE: { out: Bezier } = {
  // Not `as const`: a readonly tuple is not assignable to the mutable
  // `[number, number, number, number]` that motion's `ease` prop expects.
  out: [0.16, 1, 0.3, 1],
};

/**
 * Durations in seconds. Anything a user triggers and waits on belongs at
 * `press` or `base`; `reveal` is for scroll-entry motion, which the user is
 * not waiting on.
 */
export const DURATION = {
  /** Press feedback — the deliberate phase of a press. */
  press: 0.16,
  /** State changes: open, close, expand, collapse. Also hover responses. */
  base: 0.2,
  /** Scroll-entry reveals. */
  reveal: 0.6,
} as const;

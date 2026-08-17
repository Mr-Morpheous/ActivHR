/**
 * The site's motion vocabulary.
 *
 * WHY THIS FILE EXISTS
 * ────────────────────────────────────────────────────────────────────────────
 * Before it, "content entering the viewport" — one concept — was animated
 * three different ways: gsap `power3.out` over 0.6s in `motion/reveal.tsx`,
 * a cubic bézier over 0.7s in `motion/reveal-heading.tsx`, and BlurText's own
 * per-word stepping in `motion/blur-label.tsx`. Hover states picked from
 * `duration-300` and `duration-500` by hand, and `reactbits/BorderGlow.tsx`
 * used an asymmetric 0.25s/0.75s. Meanwhile the one genuinely well-chosen
 * spring on the site was stranded as a local literal in
 * `site/industry-tabs.tsx`.
 *
 * None of those values were wrong so much as unrelated. Craft is the claim
 * that no timing is arbitrary, which requires the timings to be named
 * somewhere you can point at.
 *
 * WHY SPRINGS ARE DESCRIBED AS bounce + duration
 * ────────────────────────────────────────────────────────────────────────────
 * Apple deliberately replaced the physics triplet (mass / stiffness / damping)
 * with two parameters a designer can reason about: a damping ratio, which
 * controls overshoot, and a response time. `motion` exposes the same idea as
 * `bounce` + `duration`, so that is how these are written.
 *
 * The convention:
 *
 *  - **`ui` — no overshoot.** The default. Critically damped is graceful and
 *    non-distracting; a menu that merely faded in has no business bouncing.
 *  - **`drawer` — slight overshoot.** Reserved for surfaces the user
 *    physically pushes or pulls. Bounce is only honest when momentum
 *    preceded it.
 *
 * `drawer` is the value `industry-tabs.tsx` had arrived at independently
 * (`stiffness: 420, damping: 34` works out to a damping ratio of ≈0.83 and a
 * response of ≈0.31s) which is in turn almost exactly Apple's published
 * figure for a sheet, 0.8 / 0.3. It was right; it just wasn't shared.
 *
 * This module is deliberately dependency-free so server components can import
 * the tokens. The hook that consumes them lives in `use-spring-number.ts`.
 */

const UI_SPRING = { bounce: 0, duration: 0.4 } as const;
const DRAWER_SPRING = { bounce: 0.2, duration: 0.3 } as const;

/**
 * Raw spring options, for `useSpring` and friends, which take the options
 * object on its own rather than a full transition.
 */
export const SPRING_OPTIONS = {
  ui: UI_SPRING,
  drawer: DRAWER_SPRING,
} as const;

/**
 * The same springs expressed as mass / stiffness / damping.
 *
 * Needed because `useSpring` does not honour the `bounce` + `duration` form:
 * measured in the browser, a figure driven that way reached its target in
 * under 60ms — moving, but far too fast to read as motion. The physics triplet
 * is the original `useSpring` API and is respected. `transition` props on
 * `motion.*` components take the friendlier form below and work correctly, so
 * both spellings exist rather than one being wrong.
 *
 * Converted with the standard mapping, for a unit mass:
 *
 *     stiffness = (2π / response)²        damping = 2 · ζ · √stiffness
 *
 * `ui` is ζ = 1.0 (critically damped, no overshoot) at a 0.4s response, which
 * gives stiffness ≈ 247 and damping ≈ 31.4 — the same motion as `SPRING.ui`,
 * just stated in the units this API accepts.
 */
export const SPRING_PHYSICS = {
  ui: { stiffness: 247, damping: 31.4, mass: 1 },
} as const;

/** Spring transitions, for the `transition` prop on a `motion.*` component. */
export const SPRING = {
  /** Default. Critically damped — reaches the target without overshooting. */
  ui: { type: "spring", ...UI_SPRING },
  /** For sheets, drawers and anything the user pushes. Slight overshoot. */
  drawer: { type: "spring", ...DRAWER_SPRING },
} as const;

/**
 * Easing curves, for the cases a spring cannot serve: something the user
 * cannot grab mid-flight, where a fixed duration is not a limitation.
 *
 * `out` is the existing hero/heading curve, kept as-is — it is the site's
 * signature entry and there was no reason to change how the brand moves,
 * only to stop it being redefined per file.
 */
type Bezier = [number, number, number, number];

export const EASE: {
  /** Fast departure, long settle. Entrances. */
  out: Bezier;
  /** The mirror of `out`. Use for the return leg of a reversible transition
   *  so the path back matches the path out. */
  in: Bezier;
} = {
  out: [0.16, 1, 0.3, 1],
  // Not `as const`: a readonly tuple is not assignable to the mutable
  // `[number, number, number, number]` that motion's `ease` prop expects.
  in: [0.7, 0, 0.84, 0],
};

/**
 * Durations in seconds. Anything a user triggers and waits on belongs at
 * `fast` or `base`; `reveal` is for scroll-entry motion, which the user is
 * not waiting on and which reads as sluggish only if it blocks something.
 */
export const DURATION = {
  /** Press feedback, hover, colour changes. */
  fast: 0.1,
  /** State changes: open, close, expand, collapse. */
  base: 0.2,
  /** Scroll-entry reveals. */
  reveal: 0.6,
} as const;

/** The same values in milliseconds, for CSS-in-JS and `setTimeout`. */
export const DURATION_MS = {
  fast: DURATION.fast * 1000,
  base: DURATION.base * 1000,
  reveal: DURATION.reveal * 1000,
} as const;

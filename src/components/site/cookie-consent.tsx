"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { DURATION, EASE, SPRING } from "@/lib/motion";

type ConsentState = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
};

const CONSENT_KEY = "activhr-cookie-consent";
const CONSENT_VERSION = "1";

export function CookieConsent() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [prefs, setPrefs] = React.useState<ConsentState>({
    necessary: true,
    preferences: true,
    analytics: true,
  });

  React.useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.version !== CONSENT_VERSION) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function saveConsent(consent: ConsentState) {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ version: CONSENT_VERSION, ...consent, decidedAt: new Date().toISOString() })
    );
    setVisible(false);
  }

  function acceptAll() {
    saveConsent({ necessary: true, preferences: true, analytics: true });
  }

  function rejectNonEssential() {
    saveConsent({ necessary: true, preferences: false, analytics: false });
  }

  function savePreferences() {
    saveConsent(prefs);
  }

  return (
    /* The sheet used to appear and disappear via `return null`, so it
       materialised out of nothing along the bottom of the page and vanished
       the same way. Things that arrive from an edge should leave by the same
       edge, so it now travels one path — `y: 100%` → `0` → `100%` — and where
       it went is never a question.

       `SPRING.drawer` is the momentum spring, and this is the one surface on
       the site entitled to it: a sheet being pushed into view, not a menu
       fading in. Overshoot is only honest when something was thrown.

       Under reduced motion it cross-fades in place instead. The sheet still
       announces itself; it just doesn't travel. */
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          // The top hairline is this surface's lit edge — the thing that makes
          // it read as a panel with thickness rather than a tinted region of
          // the page.
          className="pac-material fixed inset-x-0 bottom-0 z-50 border-t border-border px-4 py-5 shadow-lg sm:px-6"
          initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
          transition={
            reduceMotion
              ? { duration: DURATION.base, ease: EASE.out }
              : SPRING.drawer
          }
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm text-foreground">
                  We use cookies to keep you signed in, remember your
                  preferences, and understand how the site is used. See our{" "}
                  <Link href="/cookie-policy" className="text-primary underline">
                    Cookie Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <Button variant="outline" size="sm" onClick={rejectNonEssential}>
                  Reject non-essential
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails((s) => !s)}
                >
                  {showDetails ? "Hide options" : "Manage preferences"}
                </Button>
                <Button size="sm" onClick={acceptAll}>
                  Accept all
                </Button>
              </div>
            </div>

            {/* `initial={false}`: the panel must not play an opening animation
                during the first render of a sheet that is itself still sliding
                in. Two motions starting on the same frame read as one stutter,
                not as two things happening. */}
            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  key="details"
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: DURATION.base, ease: EASE.out }
                  }
                >
                  <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-4">
                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="mt-0.5 accent-primary"
                      />
                      <span>
                        <span className="font-medium">Strictly necessary</span>
                        <span className="block text-muted-foreground">
                          Required for login and core site function. Cannot be
                          disabled.
                        </span>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={prefs.preferences}
                        onChange={(e) =>
                          setPrefs({ ...prefs, preferences: e.target.checked })
                        }
                        className="mt-0.5 accent-primary"
                      />
                      <span>
                        <span className="font-medium">Preferences</span>
                        <span className="block text-muted-foreground">
                          Remembers settings like language and layout.
                        </span>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={prefs.analytics}
                        onChange={(e) =>
                          setPrefs({ ...prefs, analytics: e.target.checked })
                        }
                        className="mt-0.5 accent-primary"
                      />
                      <span>
                        <span className="font-medium">Analytics</span>
                        <span className="block text-muted-foreground">
                          Helps us understand usage patterns to improve the site.
                        </span>
                      </span>
                    </label>

                    <div className="flex justify-end">
                      <Button size="sm" onClick={savePreferences}>
                        Save preferences
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

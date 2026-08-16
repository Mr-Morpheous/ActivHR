"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ConsentState = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
};

const CONSENT_KEY = "activhr-cookie-consent";
const CONSENT_VERSION = "1";

export function CookieConsent() {
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

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-5 shadow-lg sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm text-foreground">
              We use cookies to keep you signed in, remember your preferences,
              and understand how the site is used. See our{" "}
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

        {showDetails && (
          <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-4">
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked disabled className="mt-0.5 accent-primary" />
              <span>
                <span className="font-medium">Strictly necessary</span>
                <span className="block text-muted-foreground">
                  Required for login and core site function. Cannot be disabled.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={prefs.preferences}
                onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
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
                onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
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
        )}
      </div>
    </div>
  );
}

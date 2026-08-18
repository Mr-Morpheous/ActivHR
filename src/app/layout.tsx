import { CookieConsent } from "@/components/site/cookie-consent";
import type { Metadata, Viewport } from "next";
import "./globals.css";

// Self-hosted brand typefaces (see DS-01 §02 Typography in use).
// Imported as npm packages rather than next/font/google since builds
// in this environment can't reach fonts.googleapis.com.
import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource-variable/source-serif-4/wght.css";
import "@fontsource-variable/source-serif-4/wght-italic.css";

import { ThemeProvider } from "@/components/theme-provider";
import { PowerSyncProvider } from "@/lib/powersync/provider";
import { SITE_URL } from "@/lib/site";

/**
 * Root metadata — DEFAULTS ONLY. Every route sets its own title, description
 * and canonical.
 *
 * Before this, only three files in the whole app exported metadata, so every
 * public page inherited one title, one description and — worst of all — one
 * canonical pointing at the homepage. Ten indexable pages were competing for
 * the same search result while telling Google they were the same page.
 *
 * `title.template` is what makes per-page titles cheap: a route exports
 * `title: "About"` and gets "About — ActivHR" without repeating the brand.
 * `title.default` covers any route that forgets.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ActivHR — Africa's Adaptive HR and Talent Platform",
    template: "%s — ActivHR",
  },
  description:
    // 152 characters. The previous one ran to 238, which Google truncates at
    // roughly 160 — the last third was never shown to anyone, and the
    // description is the single biggest driver of click-through from a results
    // page, so the part that gets cut is the part that was doing the selling.
    //
    // "multi-country payroll" was removed on 18 Aug 2026 along with the payroll
    // pillar: the product has no payroll engine, and a meta description is a
    // promise made in a search result, before anyone can check.
    "Attendance software for teams that work across sites: GPS-verified clock-in, offline-tolerant, with leave, rosters and exportable records.",
  // "payroll automation", "multi-country payroll", "biometric attendance" and
  // "WhatsApp ESS" all pointed at software that does not exist, and ranking for
  // a term the product cannot serve buys traffic that bounces. Replaced with
  // what someone looking for this product would actually search.
  keywords: [
    "attendance software Kenya",
    "GPS clock in app",
    "geofenced attendance",
    "staff attendance tracking",
    "shift roster software",
    "leave management Kenya",
    "multi-site workforce management",
    "offline attendance app",
    "ActivHR",
    "HR software Africa",
  ],
  authors: [{ name: "ActivHR" }],
  openGraph: {
    title: "ActivHR — Africa's Adaptive HR and Talent Platform",
    description:
      "Attendance software for teams that work across sites: GPS-verified clock-in that keeps working offline, with leave, rosters and exportable records.",
    url: "https://activhr.africa",
    siteName: "ActivHR",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ActivHR — Africa's Adaptive HR and Talent Platform",
    description:
      "Attendance software for teams that work across sites: GPS-verified clock-in that keeps working offline, with leave, rosters and exportable records.",
  },
  // NO GLOBAL `alternates.canonical`. It used to be set here to the homepage,
  // and because canonical is inherited, every other route declared itself a
  // duplicate of "/". Each route sets its own; see lib/site.ts.

  // favicon.ico alone was the entire icon set. The rest are rasterised from
  // the brand SVG — see app/manifest.ts.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* No-ops until NEXT_PUBLIC_POWERSYNC_URL is set, so the
              online-only build is unaffected. */}
          <PowerSyncProvider>{children}</PowerSyncProvider>
        </ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  );
}

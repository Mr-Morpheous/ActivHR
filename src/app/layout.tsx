import { CookieConsent } from "@/components/site/cookie-consent";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ActivHR — Africa's Adaptive HR and Talent Platform",
  description:
    "HRMIS built for the speed of African business. Automate multi-country payroll, simplify biometric and field attendance, and engage your hybrid workforce with an intuitive, mobile-first HRMIS designed for local compliance and global scale.",
  keywords: [
    "HRMIS",
    "HR software Africa",
    "payroll automation",
    "biometric attendance",
    "mobile HR",
    "WhatsApp ESS",
    "Kenyan HR software",
    "multi-country payroll",
    "ActivHR",
    "workforce management",
    "HR self-service",
  ],
  authors: [{ name: "ActivHR" }],
  openGraph: {
    title: "ActivHR — Africa's Adaptive HR and Talent Platform",
    description:
      "HRMIS built for the speed of African business. Automate multi-country payroll, simplify biometric and field attendance, and engage your hybrid workforce.",
    url: "https://activhr.africa",
    siteName: "ActivHR",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ActivHR — Africa's Adaptive HR and Talent Platform",
    description:
      "HRMIS built for the speed of African business. Automate multi-country payroll, simplify biometric and field attendance, and engage your hybrid workforce.",
  },
  alternates: {
    canonical: "https://activhr.africa",
  },
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

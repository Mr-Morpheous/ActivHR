# ActivHR — SEO Audit & Implementation Guide

**Audited:** attend-gks.vercel.app (live deployment), 13 August 2026

This covers basic on-page and technical SEO: title tags, meta descriptions, Open Graph/social preview cards, robots.txt, sitemap.xml, and structured data. It does not cover keyword research, backlink strategy, or content marketing, since those are separate disciplines from technical SEO setup.

---

## 1. Current state (what's already live)

Confirmed present on the live site:

- Title tag: `Activ-HR — Workforce Attendance & Time Management`
- Meta description: `Cloud-native, mobile-first workforce attendance and time-tracking platform for the Kenyan market.`
- Viewport meta tag set correctly

Confirmed absent:

- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`)
- Twitter Card tags
- Structured data (JSON-LD)

Not yet verified (need direct browser check, not reachable by automated fetch):

- `robots.txt`
- `sitemap.xml`

---

## 2. Priority issues

### 2.1 Brand name inconsistency — fix first, costs nothing

The site currently uses three different names in different places:

| Where | Name used |
|---|---|
| Title tag / footer | Activ-HR |
| Component names, our discussion | ActivHR |
| Contact email | hello@activ-hr.com |
| Original domain discussed | actichr.africa |
| Current live deployment | attend-gks.vercel.app |

**Why this matters for SEO specifically:** search engines treat inconsistent brand naming as a weak signal — it dilutes brand-search relevance and can cause your own pages to compete against each other in results. It also confuses anyone trying to link back to you.

**Action:** Pick one spelling (recommend **ActivHR**, no hyphen, matching your component code) and one final production domain before doing anything else below. Every fix in this document assumes you've settled this first.

### 2.2 Meta description doesn't sell your actual hook

Current: *"Cloud-native, mobile-first workforce attendance and time-tracking platform for the Kenyan market."*

This is generic — "cloud-native" and "mobile-first" are what every SaaS product claims. Your real differentiator, visible right in your hero copy, is stronger: *"Clock in from the field. See it live from the office."*

**Recommended replacement** (143 characters):

> "Attendance software for teams that aren't at a desk — GPS clock-in, biometric terminals, and live multi-site dashboards. Free trial, no credit card required."

### 2.3 No Open Graph / Twitter Card tags

This is the highest-impact gap. Per your own checklist, WhatsApp is the primary sharing channel in the Kenyan market, and without these tags, any link shared there renders as a bare URL with no title, description, or image — actively hurting click-through on your most important channel.

---

## 3. Ready-to-paste code

### 3.1 Root metadata (`src/app/layout.tsx`)

```tsx
export const metadata = {
  title: {
    template: "%s | ActivHR",
    default: "ActivHR — Workforce Attendance & Time Management",
  },
  description:
    "Attendance software for teams that aren't at a desk — GPS clock-in, biometric terminals, and live multi-site dashboards. Free trial, no credit card required.",
  openGraph: {
    title: "ActivHR — Workforce Attendance & Time Management",
    description:
      "Clock in from the field. See it live from the office. GPS clock-in, biometric terminals, live dashboards for every site.",
    url: "https://[[PLACEHOLDER: final production domain]]",
    siteName: "ActivHR",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "https://[[PLACEHOLDER: final domain]]/og-image.png",
        width: 1200,
        height: 630,
        alt: "ActivHR — Workforce Attendance & Time Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ActivHR — Workforce Attendance & Time Management",
    description: "Clock in from the field. See it live from the office.",
    images: ["https://[[PLACEHOLDER: final domain]]/og-image.png"],
  },
};
```

**Blocking dependency:** this needs an actual `og-image.png` (1200×630) designed and placed in `/public` before it'll render correctly when shared. Without it, the `images` array points to a 404.

### 3.2 robots.txt (`src/app/robots.ts`)

```tsx
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/admin", "/dashboard"],
      },
    ],
    sitemap: "https://[[PLACEHOLDER: final domain]]/sitemap.xml",
  };
}
```

### 3.3 sitemap.xml (`src/app/sitemap.ts`)

```tsx
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://[[PLACEHOLDER: final domain]]";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Add one entry per additional public route as they're built
  ];
}
```

---

## 4. Still outstanding — needs input or assets before it can be written

| Item | Blocked on |
|---|---|
| Open Graph image | Needs a designed 1200×630 image in `/public/og-image.png` |
| LocalBusiness JSON-LD schema (G5) | Needs Nairobi office address, phone number, opening hours, and lat/long coordinates |
| Favicon & PWA icons (G4/G8) | Needs actual icon assets designed at 32×32, 180×180, 192×192, 512×512 |
| Alt text audit (G4) | Needs a pass through every `<Image>` component in the codebase once other content is finalized |
| Final domain confirmation | Needed before any of the placeholder URLs above can be finalized |

---

## 5. Suggested order of operations

1. Settle the brand name and final domain (Section 2.1) — everything else depends on this
2. Paste in the `layout.tsx` metadata block (Section 3.1), with placeholders for now
3. Get the OG image designed and drop it into `/public`
4. Paste in `robots.ts` and `sitemap.ts` (Sections 3.2–3.3)
5. Check `/robots.txt` and `/sitemap.xml` render correctly in a browser
6. Submit the sitemap in Google Search Console
7. Come back for the LocalBusiness schema once you have the Nairobi office details on hand

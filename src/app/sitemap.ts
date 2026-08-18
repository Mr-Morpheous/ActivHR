import { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { publishedPosts } from "@/lib/posts";

/**
 * WHAT WAS WRONG WITH THE OLD ONE
 * ────────────────────────────────────────────────────────────────────────────
 *  - It listed fragment URLs — "/#features", "/#pillars", "/#pricing",
 *    "/#contact". A fragment is not a document. Search engines discard
 *    everything after the "#", so those four entries were four duplicate
 *    submissions of the homepage.
 *  - It omitted /about and /blog entirely, which were also linked from nowhere
 *    on the site — between the two, they were undiscoverable.
 *  - It listed /login, which robots.txt disallows. Submitting a URL you have
 *    also told crawlers not to fetch is a contradiction that shows up in Search
 *    Console as a coverage error.
 *  - `lastModified: new Date()` on every entry claimed every page changed on
 *    every build, which is noise: if everything is always fresh, nothing is.
 *
 * Blog posts come from `lib/posts.ts`, so an unpublished post cannot appear
 * here — the array is the single source of truth for what exists.
 */

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const PAGES: Entry[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/demo", priority: 0.9, changeFrequency: "monthly" },
  // /whatsapp-ess is NOT listed, and is `noindex` in its own metadata.
  //
  // The page is a full product pitch for WhatsApp employee self-service —
  // payslip delivery, leave applications and clock-in over WhatsApp, complete
  // with mocked bot transcripts. None of it exists: WhatsApp appears nowhere in
  // docs/product-reference.md, not as built, not as partial, and not on the
  // roadmap in lib/roadmap.ts. Nothing on the site links to it either.
  //
  // Submitting it to a search engine would be actively recruiting strangers to
  // a page selling software that cannot be bought. Left in the codebase rather
  // than deleted because someone wrote it deliberately and it may be a real
  // plan — but it should be deleted or rewritten, not quietly indexed.
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  // Legal pages are indexable on purpose: the handbook requires them to be
  // reachable at a stable URL without authentication, and an app-store review
  // will fetch the privacy policy directly.
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const posts = publishedPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    // A real date this time — the post's own, not "now".
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}

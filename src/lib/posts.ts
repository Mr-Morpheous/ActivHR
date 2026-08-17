/**
 * The blog index, and the only source of truth for which posts exist.
 *
 * WHAT THIS FIXES
 * ────────────────────────────────────────────────────────────────────────────
 * `app/blog/[slug]/page.tsx` was `export default function BlogPost()` — it took
 * no params and never read the slug. Every one of the five slugs listed on the
 * index rendered the same hardcoded article about biometric attendance, and so
 * did any other slug: `/blog/anything-at-all` returned 200 with that same page.
 *
 * That is one article published at five URLs (plus infinitely many more), each
 * inheriting the same title, description and canonical. To a search engine that
 * is a duplicate-content cluster competing with itself, which is worse for the
 * one real post than not publishing the other four at all.
 *
 * WHY FOUR POSTS DISAPPEARED FROM THE INDEX
 * ────────────────────────────────────────────────────────────────────────────
 * They were never written. Only the biometric post has a body; the other four
 * were title-and-excerpt entries pointing at it. They are kept here, unpublished
 * and out of the index, the sitemap and `generateStaticParams`, so the titles
 * survive as a writing queue rather than as four duplicate pages.
 *
 * The launch handbook wants five posts live before launch (C9). With this
 * change the site honestly has one. Writing the other four is the fix; five
 * links to the same article was not.
 *
 * TO PUBLISH ONE: write its body in `app/blog/[slug]/page.tsx`, then flip
 * `published` to true here. Nothing else needs touching — the index, the
 * sitemap and the static params all read this array.
 */

export type Post = {
  slug: string;
  /** The headline shown on the page. Free to be as long as it reads well. */
  title: string;
  /**
   * The `<title>` tag, when the headline is too long for one.
   *
   * A search result title is cut off past roughly 60 characters, and the
   * template adds " — ActivHR" on top, so a 67-character headline arrives at 77
   * and loses its last words in the listing. Set this whenever `title` plus ten
   * exceeds 60; omit it when the headline already fits.
   */
  seoTitle?: string;
  excerpt: string;
  /** ISO date, used for display and for sitemap lastModified. */
  date: string;
  readTime: string;
  /** False until the post actually has a body. Unpublished posts 404. */
  published: boolean;
};

export const POSTS: readonly Post[] = [
  {
    slug: "how-biometric-attendance-eliminates-time-theft",
    title: "How Biometric Attendance Eliminates Time Theft in Kenyan Workplaces",
    seoTitle: "Biometric Attendance and Time Theft in Kenya",
    excerpt:
      "Buddy punching and manual register manipulation cost Kenyan enterprises millions annually. Here is how biometric verification closes the gap.",
    date: "2026-08-15",
    readTime: "6 min read",
    published: true,
  },
  {
    slug: "payroll-compliance-kenya-2026",
    title: "Payroll Compliance in Kenya 2026: PAYE, NSSF, SHA and Housing Levy",
    excerpt:
      "A practical guide to the four statutory deductions every Kenyan employer must compute, file and remit on time.",
    date: "2026-08-10",
    readTime: "8 min read",
    published: false,
  },
  {
    slug: "mobile-geofencing-for-field-teams",
    title: "Mobile Geofencing for Field Teams: A Security Manager's Guide",
    excerpt:
      "How GPS-enforced boundaries stop fake check-ins without requiring expensive hardware at every gate.",
    date: "2026-08-05",
    readTime: "5 min read",
    published: false,
  },
  {
    slug: "whatsapp-ess-adoption-guide",
    title: "WhatsApp Employee Self-Service: The Zero-Learning-Curve ESS",
    excerpt:
      "Why WhatsApp is the most effective ESS channel in East Africa and how to roll it out to your workforce in under a week.",
    date: "2026-07-28",
    readTime: "7 min read",
    published: false,
  },
  {
    slug: "multi-site-hr-challenges",
    title: "The 5 Hidden Costs of Multi-Site HR Without a Central Platform",
    excerpt:
      // Was "what分散ed HR operations actually cost" — three Chinese characters
      // mid-sentence, live on the page. Almost certainly a machine-translation
      // artefact that survived review because nobody read the fifth card.
      "Spreadsheets, phone calls and paper registers scale badly. Here is what fragmented HR operations actually cost per site.",
    date: "2026-07-20",
    readTime: "6 min read",
    published: false,
  },
];

/** The posts that actually have a body. Everything public reads this. */
export const publishedPosts = POSTS.filter((post) => post.published);

export function findPost(slug: string) {
  return publishedPosts.find((post) => post.slug === slug);
}

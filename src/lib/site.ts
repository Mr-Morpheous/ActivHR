/**
 * The site's canonical origin, in one place.
 *
 * It was hardcoded as a string literal in `app/layout.tsx` and again in
 * `app/sitemap.ts`, which is how the two drifted: the layout declared a single
 * global canonical of `https://activhr.africa` that every page inherited, so
 * /about, /blog, /demo and the legal pages all told search engines they were
 * duplicates of the homepage and should not be indexed separately. A canonical
 * pointing at the wrong page is worse than no canonical at all.
 *
 * Every route now sets its own via `alternates.canonical`, built from this.
 */
export const SITE_URL = "https://activhr.africa";

/** Absolute URL for a route, for canonicals, OG tags and the sitemap. */
export function canonical(path = "") {
  return `${SITE_URL}${path}`;
}

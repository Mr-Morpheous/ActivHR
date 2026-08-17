import type { Metadata } from "next";

/**
 * `login/page.tsx` is a client component, so it cannot export metadata itself —
 * this layout exists only to give the route a title and to keep it out of the
 * index.
 *
 * `robots: { index: false }` duplicates the Disallow already in robots.txt on
 * purpose. The two do different jobs: robots.txt asks a crawler not to fetch
 * the page, while this tells one that reached it anyway — via a link, a shared
 * URL, or a crawler that ignores robots.txt — not to list it. A sign-in form has
 * no business in search results.
 */
export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your ActivHR organization.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

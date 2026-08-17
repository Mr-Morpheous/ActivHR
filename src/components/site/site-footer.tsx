import Link from "next/link";

/**
 * Columned footer carried over from the earlier landing page. The original
 * had a newsletter form with nothing behind it and links to a Help Center,
 * blog and API docs that don't exist — those are dropped rather than shipped
 * as dead ends.
 *
 * "Every link here resolves" is what this comment used to claim, and it was
 * false: seven of them pointed at ids that appear nowhere on the homepage.
 * `#how-it-works` and `#access` had no section at all and are replaced with the
 * sections that do exist; the five Industries anchors live inside
 * `site/industry-tabs.tsx`, which was never mounted and now is.
 *
 * ⚠️ IF YOU ADD A LINK HERE, OPEN IT. The browser check in the verification
 * pass walks every anchor in the header and asserts it resolves — extend it to
 * this footer rather than trusting a comment, which is how this drifted.
 */
const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "The 4 pillars", href: "/#pillars" },
      { label: "ROI calculator", href: "/#roi-calculator" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Field services", href: "/#field-services" },
      { label: "Security & guarding", href: "/#security" },
      { label: "Retail & warehousing", href: "/#retail" },
      { label: "Logistics", href: "/#logistics" },
      { label: "Manufacturing", href: "/#manufacturing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Company",
    links: [
      // /about and /blog had zero inbound links from anywhere on the site and
      // were absent from the sitemap, so both were unreachable except by typing
      // the URL. Linking them here is the minimum fix.
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Request a pilot", href: "/#contact" },
      { label: "Log in", href: "/login" },
      { label: "Create an organization", href: "/login?mode=sign-up" },
      { label: "hello@pac.africa", href: "mailto:hello@pac.africa" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-primary bg-pac-ink text-pac-paper">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl">ActivHR</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-pac-paper/60">
              Attendance software for teams that work on-site and in the field.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-pac-paper/70">
              <a href="tel:+254700000000" className="hover:text-pac-paper transition-colors">+254 700 000 000</a>
              <a href="mailto:hello@pac.africa" className="hover:text-pac-paper transition-colors">hello@pac.africa</a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-label text-primary">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-pac-paper/70 transition-colors hover:text-pac-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-pac-paper/15 pt-6 sm:flex-row">
          <span className="font-label text-pac-paper/50">
            ActivHR · Confidential
          </span>
          <span className="font-label text-pac-paper/50">Made in Nairobi</span>
        </div>
      </div>
    </footer>
  );
}

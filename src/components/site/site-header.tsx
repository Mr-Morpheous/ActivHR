"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DURATION, EASE, SPRING } from "@/lib/motion";

/**
 * Every entry must resolve to a real id on the homepage.
 *
 * This list previously carried `#how-it-works` and `#industries`, neither of
 * which existed: there is no how-it-works section, and the component holding
 * `#industries` was never mounted. Two of five nav items did nothing.
 *
 * Labels name their contents rather than reaching for a generic umbrella — the
 * pillars section is headed "The 4 Pillars of ActivHR", so calling it "How it
 * works" would have been a label that promises something the section isn't.
 */
const NAV = [
  { label: "Features", href: "#features" },
  { label: "Industries", href: "#industries" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/**
 * Sticky site chrome.
 *
 * WHY THIS IS A CLIENT COMPONENT
 * ────────────────────────────────────────────────────────────────────────────
 * Two reasons: `data-scrolled`, and the mobile menu.
 *
 * The header previously drew a 1px rule along its bottom edge at all times —
 * including at scroll-top, where there is nothing underneath it to be separated
 * from. A divider that is always present stops being information. Separation
 * now arrives with the content that needs separating and fades out again.
 *
 * The cost is one passive scroll listener, coalesced to one read per frame.
 * `scrollY` is read inside the frame callback rather than in the event, so a
 * burst of scroll events cannot force a burst of layout reads.
 *
 * THE MOBILE MENU
 * ────────────────────────────────────────────────────────────────────────────
 * There wasn't one. The nav was `hidden … lg:flex` with no fallback, so on a
 * 360px viewport — the stated primary audience — a visitor got the logo, a
 * theme toggle and "Sign up", and no route to Features, Pricing, FAQ or
 * Contact. Every wayfinding question the site should answer was unanswerable on
 * a phone.
 *
 * It is a panel anchored under the header rather than a full-screen takeover:
 * the header stays visible, so the control that opened it is still on screen
 * next to what it produced. It enters and leaves along one path (downward from
 * its own top edge), on the drawer spring, because a menu pulled down is a
 * surface with momentum. Under reduced motion it cross-fades in place instead.
 */
export function SiteHeader() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    // Sets the initial state for a page restored mid-scroll (a back
    // navigation, or a deep link to #pricing).
    read();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Escape closes it, and focus returns to the toggle rather than being
  // dropped at the top of the document. Never trap the user in a menu.
  React.useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Moving to a section is the whole point of the menu, so navigating closes
  // it. Without this the panel stays open over the content it just scrolled to.
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      data-scrolled={scrolled}
      className="pac-material pac-scroll-edge sticky top-0 z-40"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/logo-mark.svg"
            alt="ActivHR"
            width={130}
            height={124}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              // Same reasoning as the Button's `active:` state: on touch there
              // is no hover, so without a pressed state a nav link gives no
              // acknowledgement at all between the tap and the scroll.
              className="font-label text-muted-foreground transition-[color,opacity] duration-100 ease-out hover:text-foreground active:opacity-60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:block">
            <Button size="sm" variant="ghost">
              Log in
            </Button>
          </Link>
          <Link href="/login?mode=sign-up">
            <Button size="sm">Sign up</Button>
          </Link>

          {/* The toggle is the last item so it sits closest to the thumb on a
              phone, and it disappears at the breakpoint where the full nav
              appears — two ways to reach the same links at once is clutter. */}
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-menu"
            ref={panelRef}
            className="pac-material overflow-hidden border-t border-border lg:hidden"
            // Full transform strings, not the `y` shorthand: only opacity,
            // clipPath, filter, transform and backgroundColor are in motion's
            // hardware-accelerated set.
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: "translateY(-8px)" }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, transform: "translateY(0px)" }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: "translateY(-8px)" }
            }
            transition={
              reduceMotion
                ? { duration: DURATION.base, ease: EASE.out }
                : SPRING.drawer
            }
          >
            <nav className="mx-auto flex max-w-6xl flex-col px-6 py-3">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  // Full-width rows with a 44px target: this is the one nav a
                  // thumb has to hit, so the tap area is the row, not the text.
                  className="font-label flex min-h-11 items-center rounded-sm text-muted-foreground transition-[color,background-color] duration-100 ease-out hover:text-foreground active:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.label}
                </a>
              ))}

              {/* Log in is hidden below `sm` in the bar above, so without this
                  row a phone user has a Sign up button and no way to sign in. */}
              <Link
                href="/login"
                onClick={closeMenu}
                className="font-label flex min-h-11 items-center rounded-sm text-muted-foreground transition-[color,background-color] duration-100 ease-out hover:text-foreground active:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:hidden"
              >
                Log in
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

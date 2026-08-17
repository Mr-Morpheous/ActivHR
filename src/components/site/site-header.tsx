"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/**
 * Sticky site chrome.
 *
 * WHY THIS IS NOW A CLIENT COMPONENT
 * ────────────────────────────────────────────────────────────────────────────
 * Only for `data-scrolled`. The header previously drew a 1px rule along its
 * bottom edge at all times — including at scroll-top, where there is nothing
 * underneath it to be separated from. A divider that is always present stops
 * being information. Separation should arrive with the content that needs
 * separating, and fade out again when it doesn't.
 *
 * The cost is one passive scroll listener, coalesced to one read per frame.
 * `scrollY` is read inside the frame callback rather than in the event, so a
 * burst of scroll events cannot force a burst of layout reads.
 *
 * The surface itself is `.pac-material` (globals.css) — a translucent layer
 * with content passing behind it, rather than an opaque strip that removes 4rem
 * of viewport from the page.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);

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
    // navigation, or a deep link to #industries).
    read();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

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
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "ROI Calculator", href: "#roi-calculator" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const LANGUAGES = [
  { code: "en", label: "English", country: "ke" },
  { code: "sw", label: "Swahili", country: "ke" },
  { code: "fr", label: "French", country: "fr" },
  { code: "pt", label: "Portuguese", country: "pt" },
  { code: "ar", label: "Arabic", country: "sa" },
];

function FlagImg({ country, label }: { country: string; label: string }) {
  return (
    <img
      src={"https://flagcdn.com/24x18/" + country + ".png"}
      alt={label}
      width={20}
      height={15}
      className="rounded-[2px]"
    />
  );
}

function LanguageSwitcher() {
  const [selected, setSelected] = useState(LANGUAGES[0]);

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#2563eb] px-2.5 py-1.5 text-xs text-white transition-colors hover:bg-[#38578f]"
      >
        <FlagImg country={selected.country} label={selected.label} />
        <span className="hidden sm:inline">{selected.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-2 w-2 fill-current opacity-80 transition-transform duration-200 group-hover:rotate-180"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-40 origin-top-right scale-95 rounded-md border border-white/15 bg-[#2563eb] p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelected(lang)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-white transition-colors hover:bg-white/20"
          >
            <FlagImg country={lang.country} label={lang.label} />
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/brand/logo-mark.svg"
            alt="ActivHR"
            width={130}
            height={124}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="pointer-events-auto relative">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#2563eb]/40 blur-xl" />
            <nav className="flex items-center gap-0.5 whitespace-nowrap rounded-full bg-[#2563eb] px-1.5 py-1">
              {NAV.map((item) => (
                <a key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-label text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/login">
            <Button size="sm">Log in</Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-full bg-[#2563eb] text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute right-6 top-full z-50 mt-2 flex w-56 flex-col gap-1 rounded-md bg-[#2563eb] p-2 shadow-lg lg:hidden">
          {NAV.map((item) => (
            <a key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  { code: "en", label: "English", flag: "KE" },
  { code: "sw", label: "Swahili", flag: "KE" },
  { code: "fr", label: "French", flag: "FR" },
  { code: "pt", label: "Portuguese", flag: "PT" },
  { code: "ar", label: "Arabic", flag: "SA" },
];

function LanguageSwitcher() {
  const [selected, setSelected] = useState(LANGUAGES[0]);

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/30 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-foreground backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <span className="flex h-4 w-6 items-center justify-center rounded-sm bg-primary/15 text-[10px] font-semibold text-primary">
          {selected.flag}
        </span>
        <span className="hidden sm:inline">{selected.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-2.5 w-2.5 fill-current opacity-70 transition-transform duration-200 group-hover:rotate-180"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-40 origin-top-right scale-95 rounded-md border border-white/15 bg-white/10 p-1 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelected(lang)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-white/20"
          >
            <span className="flex h-4 w-6 items-center justify-center rounded-sm bg-primary/15 text-[10px] font-semibold text-primary">
              {lang.flag}
            </span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
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

        <div className="relative hidden lg:block">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#004990]/30 blur-xl" />
          <nav className="flex items-center gap-2 rounded-full border border-white/15 bg-[#004990] px-3 py-1.5 backdrop-blur-md">
            {NAV.map((item) => (
              <a key={item.href}
                href={item.href}
                className="rounded-full px-5 py-2 font-label text-sm text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/login">
            <Button size="sm">Log in</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

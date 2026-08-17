import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { publishedPosts } from "@/lib/posts";
import type { Metadata } from "next";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights & Resources",
  description:
    "Practical guides on biometric attendance, Kenyan payroll compliance, geofencing for field teams, and mobile-first workforce management for HR leaders.",
  alternates: { canonical: canonical("/blog") },
  openGraph: {
    title: "Insights & Resources — ActivHR",
    description:
      "Practical guides on biometric attendance, Kenyan payroll compliance, geofencing for field teams, and mobile-first workforce management for HR leaders.",
    url: canonical("/blog"),
  },
};



export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BlurLabel
            text="Insights & Resources"
            className="font-label text-primary"
          />
          <RevealHeading
            as="h1"
            delay={0.15}
            className="type-display mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
          >
            HR Leadership for <span className="italic text-primary sm:whitespace-nowrap">African Business</span>
          </RevealHeading>

          <p className="mt-6 max-w-xl text-muted-foreground">
            Practical guides on attendance, payroll compliance, biometric security, and mobile-first workforce management.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{new Date(post.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl leading-snug mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

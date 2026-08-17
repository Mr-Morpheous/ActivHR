import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const POSTS = [
  {
    slug: "how-biometric-attendance-eliminates-time-theft",
    title: "How Biometric Attendance Eliminates Time Theft in Kenyan Workplaces",
    excerpt:
      "Buddy punching and manual register manipulation cost Kenyan enterprises millions annually. Here is how biometric verification closes the gap.",
    date: "2026-08-15",
    readTime: "6 min read",
  },
  {
    slug: "payroll-compliance-kenya-2026",
    title: "Payroll Compliance in Kenya 2026: PAYE, NSSF, SHA and Housing Levy",
    excerpt:
      "A practical guide to the four statutory deductions every Kenyan employer must compute, file and remit on time.",
    date: "2026-08-10",
    readTime: "8 min read",
  },
  {
    slug: "mobile-geofencing-for-field-teams",
    title: "Mobile Geofencing for Field Teams: A Security Manager's Guide",
    excerpt:
      "How GPS-enforced boundaries stop fake check-ins without requiring expensive hardware at every gate.",
    date: "2026-08-05",
    readTime: "5 min read",
  },
  {
    slug: "whatsapp-ess-adoption-guide",
    title: "WhatsApp Employee Self-Service: The Zero-Learning-Curve ESS",
    excerpt:
      "Why WhatsApp is the most effective ESS channel in East Africa and how to roll it out to your workforce in under a week.",
    date: "2026-07-28",
    readTime: "7 min read",
  },
  {
    slug: "multi-site-hr-challenges",
    title: "The 5 Hidden Costs of Multi-Site HR Without a Central Platform",
    excerpt:
      "Spreadsheets, phone calls and paper registers scale badly. Here is what分散ed HR operations actually cost per site.",
    date: "2026-07-20",
    readTime: "6 min read",
  },
] as const;

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
            className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
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
          {POSTS.map((post, i) => (
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

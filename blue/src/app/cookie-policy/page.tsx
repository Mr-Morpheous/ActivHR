import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { Separator } from "@/components/ui/separator";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen">
      <section id="cookie-policy" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="font-label text-primary">Legal</span>
          <span className="font-serif text-xl italic text-primary">Cookie Policy</span>
        </div>
        <RevealHeading className="font-serif text-3xl">
          Cookie Policy
        </RevealHeading>
        <Separator className="mt-4 mb-8" />
        <p className="mt-4 text-muted-foreground">
          ActivHR Cookie Policy<br/>
          12/08/2026<br/>
          This Cookie Policy explains how PRIORITY ACTIVATOR CONSULTING (“ActivHR”, “we”, “us”) uses cookies and similar technologies on actichr.africa and within the ActivHR web application (together, the “Service”). It should be read alongside our Privacy Policy at actichr.africa/privacy.<br/>
          This policy covers the marketing site and web dashboard. It does not apply to the ActivHR mobile app, which does not use browser cookies; mobile data collection is covered in the Privacy Policy and the Employee Notice.<br/><br/>
          1. What cookies are<br/>
          Cookies are small text files placed on your device when you visit a website. They let the site remember information about your visit, such as your login session or preferences, and can also be used to recognise you across visits or sites.<br/>
          Under the Kenya Data Protection Act, 2019, a cookie that can be linked to an identifiable individual is personal data, and its use is subject to the same principles as any other processing.<br/><br/>
          2. Cookies we use<br/>
          Category | Purpose | Examples | Can you opt out?<br/>
          Strictly necessary | Required for login, session security, and core site function. Cannot be disabled. | Session token, CSRF protection, load balancing | No<br/>
          Preferences | Remember settings such as language or dashboard layout. | Language selection, sidebar state | Yes<br/>
          Analytics | Help us understand usage patterns to improve the Service. | Google Analytics, Vercel Analytics | Yes<br/>
          Third party / embedded | Set by services embedded in our pages. Google sign in, support chat widget, if used | Yes, where set by third parties, via their own controls<br/><br/>
          3. Cookies we do not use<br/>
          We do not use cookies for advertising or ad retargeting, and we do not sell or share cookie data with third parties for their own marketing purposes.<br/><br/>
          4. Third party cookies<br/>
          Some pages may set cookies from third party services we rely on to operate the Service, including Supa base and Google Maps. These third parties’ use of cookies is governed by their own privacy and cookie policies, which we link to where available.<br/><br/>
          5. Your choices<br/>
          5.1 On your first visit, you will see a cookie banner allowing you to accept all cookies, reject non essential cookies, or manage preferences by category.<br/>
          5.2 You can change your preferences at any time<br/>
          5.3 You can also block or delete cookies through your browser settings. Blocking strictly necessary cookies may prevent you from logging in or using core features of the web dashboard.<br/><br/>
          6. How long cookies last<br/>
          Session cookies are deleted when you close your browser.<br/>
          Persistent cookies remain for up to 12 months, unless you delete them sooner.<br/><br/>
          7. Changes to this policy<br/>
          We may update this Cookie Policy from time to time. Material changes will be reflected by an updated effective date at the top of this page, and, where required, we will seek renewed consent via the cookie banner.<br/><br/>
          8. Contact us<br/>
          For questions about this policy or to exercise your rights under the Kenya Data Protection Act, contact info@activhr.africa.
        </p>
      </section>
    </div>
  );
}
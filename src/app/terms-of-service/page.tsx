import { RevealHeading } from "@/components/motion/reveal-heading";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import type { Metadata } from "next";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of ActivHR: your obligations, acceptable use, service commitments, liability limits, and how either party may end the agreement.",
  alternates: { canonical: canonical("/terms-of-service") },
  openGraph: {
    title: "Terms of Service — ActivHR",
    description:
      "The terms governing use of ActivHR: your obligations, acceptable use, service commitments, liability limits, and how either party may end the agreement.",
    url: canonical("/terms-of-service"),
  },
};


export default function TermsOfService() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section id="terms-of-service" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="font-label text-primary">Legal</span>
          <span className="font-serif text-xl italic text-primary">Terms of Service</span>
        </div>
        <RevealHeading as="h1" className="type-display font-serif text-3xl">
          Terms of Service
        </RevealHeading>
        <Separator className="mt-4 mb-8" />
        <p className="mt-4 text-muted-foreground">
          ActivHR Terms of Service<br/>
          12/08/2026<br/>
          These Terms of Service (&quot;Terms&quot;) govern access to and use of ActivHR (the &quot;Service&quot;), provided by PRIORITY ACTIVATOR CONSULTING a company registered in Kenya with its registered office at JASMINE CENTER, WESTLANDS (&quot;ActivHR&quot;, &quot;we&quot;, &quot;us&quot;), by the organisation identified on the applicable Order Form (&quot;Client&quot;, &quot;you&quot;).<br/>
          These Terms apply to the Client organisation only. Users are governed by the separate ActivHR Employee Notice, available at activhr.africa/employee-notice.<br/><br/>
          1. Definitions<br/>
          &quot;Order Form&quot;, &quot;Personal Data&quot;, &quot;Processing&quot;, &quot;Data Controller&quot;, &quot;Data Processor&quot;, &quot;Data Subject&quot;, &quot;Biometric Data&quot;, &quot;Client Data&quot;, &quot;Sub-processor&quot;.<br/><br/>
          2. The Service<br/>
          2.1 PAC Africa will provide the Service in accordance with the plan specified in the applicable Order Form.<br/>
          2.2 Service Level Commitment: [[PLACEHOLDER]]<br/>
          2.3 PAC Africa may modify or update the Service&apos;s features.<br/>
          2.4 Support: [[PLACEHOLDER]]<br/><br/>
          3. Data Protection and Processing Roles<br/>
          [[PLACEHOLDER for full section details from docx]]<br/><br/>
          4. Client Obligations<br/>
          4.1 Accuracy of data inputs.<br/>
          4.2 Lawful use.<br/>
          4.3 Credential management.<br/><br/>
          5. Acceptable Use<br/>
          [[PLACEHOLDER: List of prohibited actions from docx]]<br/><br/>
          6. Fees and Payment<br/>
          [[PLACEHOLDER: payment terms]]<br/><br/>
          7. Term and Termination<br/>
          [[PLACEHOLDER: details from docx]]<br/><br/>
          8. Warranties and Disclaimers<br/>
          [[PLACEHOLDER: details from docx]]<br/><br/>
          9. Limitation of Liability<br/>
          [[PLACEHOLDER: details from docx]]<br/><br/>
          10. Indemnification<br/>
          [[PLACEHOLDER: details from docx]]<br/><br/>
          11. Confidentiality<br/>
          [[PLACEHOLDER: details from docx]]<br/><br/>
          12. General<br/>
          12.1 Governing law: Republic of Kenya.<br/>
          12.2 Dispute resolution: [[PLACEHOLDER]]<br/>
          12.3 Assignment: [[PLACEHOLDER]]<br/>
          12.4 Force majeure: [[PLACEHOLDER]]<br/>
          12.5 Amendments: [[PLACEHOLDER]]
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}

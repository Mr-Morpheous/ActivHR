import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="min-h-screen">
      <section id="terms-of-service" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="font-label text-primary">Legal</span>
          <span className="font-serif text-xl italic text-primary">Terms of Service</span>
        </div>
        <RevealHeading className="font-serif text-3xl">
          Terms of Service
        </RevealHeading>
        <Separator className="mt-4 mb-8" />
        <p className="mt-4 text-muted-foreground">
          ActivHR Terms of Service<br/>
          12/08/2026<br/>
          These Terms of Service (“Terms”) govern access to and use of ActivHR (the “Service”), provided by PRIORITY ACTIVATOR CONSULTING a company registered in Kenya with its registered office at JASMINE CENTER, WESTLANDS (“ActivHR”, “we”, “us”), by the organisation identified on the applicable Order Form (“Client”, “you”).<br/>
          These Terms apply to the Client organisation only. Users are governed by the separate ActivHR Employee Notice, available at actichr.africa/employee-notice.<br/><br/>
          1. Definitions<br/>
          “Order Form”, “Personal Data”, “Processing”, “Data Controller”, “Data Processor”, “Data Subject”, “Biometric Data”, “Client Data”, “Sub-processor”.<br/><br/>
          2. The Service<br/>
          2.1 PAC Africa will provide the Service in accordance with the plan specified in the applicable Order Form.<br/>
          2.2 Service Level Commitment: [[PLACEHOLDER]]<br/>
          2.3 PAC Africa may modify or update the Service’s features.<br/>
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
    </div>
  );
}
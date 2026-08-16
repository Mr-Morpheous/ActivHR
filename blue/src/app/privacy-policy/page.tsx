import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <section id="privacy-policy" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="font-label text-primary">Legal</span>
          <span className="font-serif text-xl italic text-primary">Privacy Policy</span>
        </div>
        <RevealHeading className="font-serif text-3xl">
          Privacy Policy
        </RevealHeading>
        <Separator className="mt-4 mb-8" />
        <p className="mt-4 text-muted-foreground">
          ActivHR Privacy Policy<br/>
          12/08/2026<br/>
          This Privacy Policy explains how Priority Activator consulting (“ActivHR”, “we”, “us”) collects, uses, and protects personal data through ActivHR (the “Service”), in accordance with the Kenya Data Protection Act, 2019 (“the Act”).<br/>
          This Policy applies to two groups of people, and the sections below indicate which apply to which: Client organisations that subscribe to ActivHR; Employees and other individuals (“Users”) whose attendance data is processed through ActivHR on behalf of a Client organisation. If you are an employee using ActivHR through your employer, please also read the ActivHR Employee Notice at actichr.africa/employee-notice, which explains your rights in plain language.<br/><br/>
          1. Who we are and our role<br/>
          For Client organisations, ActivHR acts as a Data Processor, processing User personal data only on the Client’s instructions. The Client organisation is the Data Controller responsible for its employees’ data. [[PLACEHOLDER pending L1 legal opinion: confirm this characterisation applies across all deployment models before publishing]]<br/>
          For data we collect directly from Client organisations themselves, such as billing contacts and account administrator details, ActivHR acts as a Data Controller.<br/>
          Our data protection contact: [[PLACEHOLDER: data protection contact email]]<br/><br/>
          2. What data we collect<br/>
          Data category | Collected from | Examples<br/>
          Account and billing data | Client organisation | Company name, billing contact, payment details<br/>
          User identity data | Client organisation | Employee name, employee ID, role<br/>
          Attendance data | User, via the app | Clock-in and clock-out timestamps<br/>
          Location data | User, via the app | [[PLACEHOLDER: if applicable, confirm whether location is collected]]<br/>
          Biometric data | User, via the app | Fingerprint template, collected only if the Client enables biometric roll-call and the User consents<br/>
          Technical data | Automatically | Device type, app version, IP address, log data<br/>
          Cookies | Web dashboard visitors | See our Cookie Policy at actichr.africa/cookie-policy<br/>
          We do not collect biometric data unless biometric roll-call is enabled by the Client and the individual User has given explicit, opt-in consent. See Section 5.<br/><br/>
          3. Why we process this data<br/>
          To provide the attendance tracking and reporting features of the Service<br/>
          To verify User identity at clock-in, including via biometric matching where enabled<br/>
          To maintain account security and prevent misuse<br/>
          To communicate service updates, maintenance notices, and support responses<br/>
          To meet legal and regulatory obligations, including retention and reporting requirements<br/><br/>
          4. Lawful basis for processing<br/>
          [[PLACEHOLDER pending L1 legal opinion: insert confirmed lawful basis per data category, likely a mix of: performance of the Client’s contract with its employees, the Client’s legitimate interest in workforce management, explicit consent for biometric data, and compliance with legal obligations. Do not finalise before counsel review.]]<br/><br/>
          5. Biometric data specifically<br/>
          Biometric data is sensitive personal data under the Act and receives additional protection:<br/>
          Collected only when the Client organisation enables biometric roll-call<br/>
          Requires explicit opt-in consent from the individual User, captured with a timestamp and policy version<br/>
          Users who decline can still clock in using an alternative method (see the Employee Notice)<br/>
          Stored as a mathematical template, not a reconstructable image, and encrypted at rest [[PLACEHOLDER: confirm actual technical implementation before publishing]]<br/>
          Retained only for [[PLACEHOLDER pending L4: retention window, e.g. duration of employment plus X days]] and deleted thereafter<br/><br/>
          6. Who we share data with<br/>
          We do not sell personal data. We share data only with:<br/>
          Sub-processors, who process data on our behalf to operate the Service:<br/>
          [[PLACEHOLDER: List of Sub-processors, Purpose, Location]]<br/>
          Other Client-authorised recipients, such as the Client’s own HR or payroll systems, where the Client configures an integration or export.<br/>
          Legal and regulatory bodies, where required by law, including the Office of the Data Protection Commissioner (ODPC).<br/>
          Cross-border transfers: [[PLACEHOLDER: Cross-border transfer details]]<br/><br/>
          7. How long we keep data<br/>
          We retain personal data only as long as necessary for the purposes described in this Policy. Data is deleted automatically at the end of each retention window through scheduled deletion processes.<br/><br/>
          8. Your rights<br/>
          Under the Act, individuals have the right to: Be informed of the use to which their personal data is to be put; Access their personal data; Request correction of inaccurate or outdated data; Request deletion of false or unlawfully collected data; Object to the processing of some or all of their data; Withdraw consent, where processing is based on consent (such as biometric enrolment); Lodge a complaint with the Office of the Data Protection Commissioner (ODPC).<br/>
          Employees: To exercise these rights, contact your employer’s HR team or [[PLACEHOLDER: ActivHR data protection contact]].<br/>
          Client organisations: Contact [[PLACEHOLDER: contact]] for data access, export, or deletion requests relating to your account.<br/><br/>
          9. Data security<br/>
          We implement technical and organisational measures appropriate to the sensitivity of the data processed, including encryption in transit, access controls, and [[PLACEHOLDER: additional measures]].<br/><br/>
          10. Data breach notification<br/>
          In the event of a personal data breach affecting User data, we will notify the affected Client organisation without undue delay, and in any event within [[PLACEHOLDER: e.g. 72 hours]] of becoming aware, so the Client can meet its own notification obligations.<br/><br/>
          11. Children’s data<br/>
          The Service is not directed at, and we do not knowingly collect data from, individuals under the age of 18. ActivHR is intended for use by employed adults within a Client organisation’s workforce.<br/><br/>
          12. Changes to this policy<br/>
          We may update this Privacy Policy from time to time.<br/><br/>
          13. Contact us<br/>
          For questions about this Policy or to exercise your data protection rights, contact:[[PLACEHOLDER: data protection contact name/role and email]]<br/>
          You may also lodge a complaint directly with the Office of the Data Protection Commissioner (ODPC), Kenya.
        </p>
      </section>
    </div>
  );
}
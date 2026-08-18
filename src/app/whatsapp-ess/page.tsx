import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BlurLabel } from "@/components/motion/blur-label";
import { Separator } from "@/components/ui/separator";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import type { Metadata } from "next";
import { canonical } from "@/lib/site";

/**
 * ⚠️ THIS PAGE DESCRIBES SOFTWARE THAT DOES NOT EXIST.
 *
 * Every flow below — payslips over WhatsApp, leave applications, clock-in,
 * the PIN authentication, the bot transcripts — is a mock-up. WhatsApp appears
 * nowhere in docs/product-reference.md: not in "Built and working", not in
 * "Partial", and not in lib/roadmap.ts either. There is no WhatsApp
 * integration in this codebase.
 *
 * Set to `noindex` and removed from the sitemap on 18 Aug 2026 so it stops
 * being promoted to strangers. Nothing on the site links to it, so it is
 * currently unreachable except by typing the URL.
 *
 * It is kept rather than deleted because it reads as a deliberate product
 * proposal and may be a real plan. Decide one of three things and act on it:
 * build it, rewrite it as a clearly-labelled roadmap page, or delete it. Do not
 * leave it here indefinitely as a page that would mislead anyone who found it.
 */
export const metadata: Metadata = {
  title: "WhatsApp Employee Self-Service",
  robots: { index: false, follow: false },
  description:
    "Give your workforce self-service through WhatsApp — payslips, leave requests and attendance — with no app to install and no training required.",
  alternates: { canonical: canonical("/whatsapp-ess") },
  openGraph: {
    title: "WhatsApp Employee Self-Service — ActivHR",
    description:
      "Give your workforce self-service through WhatsApp — payslips, leave requests and attendance — with no app to install and no training required.",
    url: canonical("/whatsapp-ess"),
  },
};


export default function WhatsAppESSPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BlurLabel
            text="WhatsApp Employee Self-Service"
            className="font-label text-primary"
          />
          <RevealHeading
            as="h1"
            delay={0.15}
            className="type-display mt-5 font-serif text-5xl leading-[1.05] md:text-6xl"
          >
            HR in Every <span className="whitespace-nowrap italic text-primary">Pocket</span>
          </RevealHeading>

          <p className="mt-6 max-w-xl text-muted-foreground">
            Zero learning curve. Staff apply for leave, download payslips, and clock in — all via WhatsApp or the ActivHR mobile app. Built for low-bandwidth environments and field teams.
          </p>
        </div>
      </section>

      {/* Core Interactive Menu Hierarchy */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Core Interactive <span className="italic text-primary">Menu Hierarchy</span>
        </RevealHeading>
        <p className="mt-4 max-w-lg text-muted-foreground">
          The inbound WhatsApp flow presents staff with a simple numbered menu for instant access to all self-service functions.
        </p>
        <Separator className="mt-4 mb-10" />

        <Reveal>
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <div className="font-mono text-sm space-y-4">
              <div>
                <span className="text-muted-foreground">User:</span> Hi or Menu
              </div>
              <div>
                <span className="text-primary font-medium">ActivHR Bot:</span>
                <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`👋 Hello {{Employee_First_Name}}! Welcome to ActivHR Self-Service ({{Company_Name}}).

How can I assist you today? Reply with a number or keyword:

1️⃣ Payslips & Financials
2️⃣ Leave & Time Off
3️⃣ Clock-In / Location Verification
4️⃣ Company Announcements & Policies
5️⃣ Talk to HR Support`}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Conversational Menu Sub-Flows */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Conversational Menu <span className="italic text-primary">Sub-Flows</span>
        </RevealHeading>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-8 [&>*]:min-w-0">
          {/* Flow 1: Payslips & Financials */}
          <Reveal>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Flow 1</div>
              <h3 className="font-serif text-xl mb-4">Payslips & Financials</h3>
              <div className="font-mono text-sm space-y-3">
                <div><span className="text-muted-foreground">User:</span> 1</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`📄 Payslip & Financial Services
Please select an option:
1A — Download Latest Payslip (PDF)
1B — View YTD Tax Summary
1C — Request Expense Reimbursement
0 — Back to Main Menu`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> 1A</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`🔒 For security, please enter the 4-digit PIN sent to your registered mobile number:`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> 4821</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`✅ Authentication Successful! Here is your {{Month_Year}} Payslip (Password protected with your National ID number):

📄 Payslip_{{Employee_ID}}_{{Month_Year}}.pdf (Attached Document)

Reply 0 to return to the Main Menu.`}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Flow 2: Leave Application */}
          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Flow 2</div>
              <h3 className="font-serif text-xl mb-4">Leave Application & Balances</h3>
              <div className="font-mono text-sm space-y-3">
                <div><span className="text-muted-foreground">User:</span> 2</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`🌴 Leave & Time Off Portal

📊 Your Current Balances:
• Annual Leave: 14 Days
• Sick Leave: 7 Days
• Compassionate Leave: 5 Days

Reply with:
2A — Apply for Leave
2B — View Pending Leave Requests
0 — Back to Main Menu`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> 2A</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`Please enter your Leave Start Date in DD/MM/YYYY format (e.g., 01/09/2026):`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> 01/09/2026</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`Enter your Leave End Date in DD/MM/YYYY format:`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> 05/09/2026</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`You are applying for 5 Days of Annual Leave from 01/09/2026 to 05/09/2026.

Reply YES to confirm and submit to your manager ({{Manager_Name}}) for approval.`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> YES</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`🎉 Submitted! Your leave request #LV-9042 has been sent to {{Manager_Name}}. We will notify you here once reviewed.`}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Flow 3: Field Clock-In */}
          <Reveal delay={0.2}>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Flow 3</div>
              <h3 className="font-serif text-xl mb-4">Field & Remote Clock-In (GPS Geo-Fencing)</h3>
              <div className="font-mono text-sm space-y-3">
                <div><span className="text-muted-foreground">User:</span> 3</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`📍 Field Clock-In / Out

Please tap the clip icon 📎 below and select "Location" to share your current location for attendance verification.`}
                  </div>
                </div>
                <div><span className="text-muted-foreground">User:</span> (shares WhatsApp Location)</div>
                <div>
                  <span className="text-primary font-medium">ActivHR Bot:</span>
                  <div className="mt-2 whitespace-pre-wrap break-words text-foreground">
{`✅ Location Verified!
• Site: Westlands Regional Office Hub
• Timestamp: 08:02 AM, 16 Aug 2026
• Status: Clocked IN successfully. Have a productive day!`}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* Automated Push Notification Scripts */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <RevealHeading className="font-serif text-3xl">
          Automated Push Notification <span className="italic text-primary">Scripts</span>
        </RevealHeading>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Outbound automated notifications triggered by system events, delivered via WhatsApp.
        </p>
        <Separator className="mt-4 mb-10" />

        <div className="grid gap-6 [&>*]:min-w-0 md:grid-cols-3">
          <Reveal>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Script A</div>
              <h3 className="font-serif text-xl mb-2">Manager Leave Approval Request</h3>
              <p className="text-xs text-muted-foreground mb-4">Triggered when a direct report submits leave</p>
              <div className="font-mono text-sm text-muted-foreground">
                <p>Recipient: Line Manager</p>
                <p className="mt-2 whitespace-pre-wrap break-words">{`📩 New Leave Request Pending Approval

Employee: {{Employee_Name}}
Type: Annual Leave
Dates: {{Start_Date}} to {{End_Date}} ({{Total_Days}} Days)
Remaining Balance: {{Leave_Balance}} Days

Reply to take action:
Reply APPROVE {{Request_ID}} to approve
Reply REJECT {{Request_ID}} to decline`}</p>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Script B</div>
              <h3 className="font-serif text-xl mb-2">Monthly Payslip Availability Alert</h3>
              <p className="text-xs text-muted-foreground mb-4">Triggered when payroll processing completes</p>
              <div className="font-mono text-sm text-muted-foreground">
                <p>Recipient: All Active Employees</p>
                <p className="mt-2 whitespace-pre-wrap break-words">{`💰 Your {{Month_Year}} Payslip is Ready!

Dear {{First_Name}}, your payslip for {{Month_Year}} has been generated and processed.

Reply PAYSLIP to view and download your secure PDF document instantly.`}</p>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.2}>
            <SpotlightCard className="h-full">
              <div className="font-label text-primary mb-2">Script C</div>
              <h3 className="font-serif text-xl mb-2">Weekly Roster & Schedule Alert</h3>
              <p className="text-xs text-muted-foreground mb-4">Published every Sunday for branch and field workers</p>
              <div className="font-mono text-sm text-muted-foreground">
                <p>Recipient: Field & Branch Workers</p>
                <p className="mt-2 whitespace-pre-wrap break-words">{`📅 Weekly Roster Published

Hi {{First_Name}}, here is your schedule for the upcoming week:

Mon: 08:00 AM - 05:00 PM (Branch A)
Tue: 08:00 AM - 05:00 PM (Branch A)
Wed: OFF
Thu - Sat: 10:00 AM - 07:00 PM (Branch B)

Reply ROSTER to swap a shift or contact your supervisor.`}</p>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

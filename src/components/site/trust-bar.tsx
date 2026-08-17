import { Reveal } from "@/components/motion/reveal";

/**
 * ⚠️ ADD A NAME HERE ONLY IF THAT CUSTOMER IS REAL AND HAS CONSENTED.
 *
 * This list held five names — Nairobi Facilities Ltd, Coastline Logistics,
 * Savannah Security Co, Rift Valley Retail, Mombasa Freight Co — under the
 * heading "Trusted by growing teams across East Africa". None could be
 * substantiated anywhere in the repo or its docs, and a customer list is the
 * one claim on a marketing site that is straightforwardly actionable if it is
 * invented. Emptied on 18 Aug 2026 pending confirmation from the product owner.
 *
 * The component renders nothing while this is empty, so restoring the band is a
 * one-line change once there are real, permissioned names to put in it.
 */
const CLIENTS: readonly string[] = [];

/**
 * Masthead-style client band. DS-01 is a document format, so these are set
 * as mono rules-and-labels rather than the pill chips the earlier landing
 * page used — pills fight the 0.2rem corner radius the rest of the app uses.
 */
export function TrustBar() {
  if (CLIENTS.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/30">
      <Reveal className="mx-auto max-w-6xl px-6 py-8">
        <p className="font-label text-center text-muted-foreground">
          Trusted by growing teams across East Africa
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {CLIENTS.map((name) => (
            <li
              key={name}
              className="font-serif text-sm text-foreground/70 md:text-base"
            >
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

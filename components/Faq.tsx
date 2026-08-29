import { MIN_AGE } from "@/app/lib/booking-schema";
import { siteConfig } from "@/app/lib/site-config";

// TODO (owner): confirm deposit, fuel policy and cancellation wording —
// tracked in FOLLOWUP.md. Placeholders are deliberately non-committal.
export const faqs = [
  {
    q: "How old do I have to be to rent a car?",
    a: `Drivers must be at least ${MIN_AGE} years old and hold a full licence held for at least one year. Bring your licence and passport or ID at pickup.`,
  },
  {
    q: "Do you deliver the car to the airport or my hotel?",
    a: "Yes — tell us your pickup point when you book and we'll meet you there. Pafos Airport, your hotel or your villa are all fine.",
  },
  {
    q: "Is insurance included?",
    a: "Basic insurance is included in every rental. Ask us about extra cover when we confirm your booking.",
  },
  {
    q: "What about a deposit and fuel?",
    a: "We'll confirm the deposit and fuel policy when we call you about your booking.",
  },
  {
    q: "How much is a taxi from Pafos Airport?",
    a: "A taxi for up to 4 people is €35. Larger groups travel by minibus — open the full transfer price list in the Taxi section for every destination and group size.",
  },
  {
    q: "Which languages do you speak?",
    a: "English and Russian.",
  },
  {
    q: "Can I cancel or change my booking?",
    a: `Call or WhatsApp us on ${siteConfig.phone} as early as you can and we'll sort it out.`,
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-32 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
          Good to know
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Questions we get asked
        </h2>

        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                {item.q}
                <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-45 motion-reduce:transition-none">
                  +
                </span>
              </summary>
              <p className="mt-2 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

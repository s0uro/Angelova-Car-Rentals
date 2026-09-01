import Link from "next/link";
import { fromDailyRate } from "@/app/lib/fleet-data";
import LazyBookingForm from "@/components/LazyBookingForm";
import TypewriterText from "@/components/TypewriterText";
import FleetCarousel from "@/components/FleetCarousel";
import Reviews from "@/components/Reviews";
import HeroVideo from "@/components/HeroVideo";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import TaxiRatesDialog from "@/components/TaxiRatesDialog";
import { fromPrice } from "@/app/lib/taxi-data";

const whyUs = [
  { title: "We bring the car to you", body: "Airport, hotel or villa — no queue, no shuttle bus." },
  { title: "One price, no surprises", body: "A/C and basic insurance included in every rate you see." },
  { title: "English & Russian", body: "Talk to us in the language you are comfortable in." },
  { title: "Cars and taxis together", body: "Rent for the week, and let us drive you on airport day." },
];

const heroSubline = `Cars from €${fromDailyRate}/day · Fixed-price airport transfers from €${fromPrice("pafos-airport")} · No deposit to book`;

export default function HomePage() {
  return (
    <div>
      <JsonLd />
      <section id="home" className="relative -mt-24 flex min-h-[100svh] scroll-mt-32 items-center border-b border-slate-200 pb-10 pt-28 sm:-mt-28 sm:py-16 lg:-mt-32">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 text-center sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Car rental &amp; taxi
              <span className="block text-brand">in Paphos</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
              <TypewriterText text={heroSubline} />
            </p>

            <p className="mt-3 text-sm text-slate-300 sm:mt-4">
              We meet you at Pafos Airport with the keys — and deliver free to your
              hotel or villa, too.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-6 text-center shadow-2xl backdrop-blur-md sm:p-7">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Reserve your car or transfer
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                Tell us your dates and where you are. We confirm every booking
                personally by phone or WhatsApp — usually within the hour, with no
                deposit to reserve.
              </p>
              <a
                href="#booking"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-base"
              >
                Book now
                <span aria-hidden="true">&rarr;</span>
              </a>
              <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                {["No deposit", "Free airport & hotel delivery", "English & Russian"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 shrink-0 text-brand"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m4 10 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-12 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
              Most booked
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Our best rides, ready when you are
            </h2>
            <p className="mt-2 max-w-xl text-base text-slate-600 sm:text-lg">
              From nimble city runs to seven seats for the whole family. Every car is
              air-conditioned with basic insurance included.
            </p>
          </div>
          <Link
            href="/fleet"
            className="w-full shrink-0 rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-brand-dark sm:w-auto"
          >
            View all fleet
          </Link>
        </div>

        <div className="mt-8">
          <FleetCarousel />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
            About us
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            A family-run car rental &amp; taxi service in Paphos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            No counter, no queue. The person who answers the phone is the one who
            hands you the keys — and meets you at the airport. We live here, we know
            the island, and we speak English &amp; Russian.
          </p>
          <Link
            href="/about"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            More about us
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      <section className="hidden border-t border-slate-200 bg-slate-50 sm:block">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => (
            <div
              key={item.title}
              className="rounded-full bg-white px-6 py-6 text-center shadow-sm ring-1 ring-slate-200 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left sm:shadow-none sm:ring-0"
            >
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="booking"
        className="scroll-mt-32 border-y border-slate-200 bg-slate-50 px-4 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
              Reserve in a minute
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Book your car or transfer
            </h2>
            <p className="mt-2 text-base text-slate-600 sm:text-lg">
              Send the request now — we confirm everything by phone or WhatsApp.
            </p>
          </div>
          <div className="mt-6 sm:mt-8">
            <LazyBookingForm />
          </div>
        </div>
      </section>

      <section id="taxi" className="scroll-mt-32 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Taxi &amp; minibus
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-4xl">
            Fixed-price transfers, anywhere in Cyprus
          </h2>
          <p className="mt-2 max-w-2xl text-base text-slate-300 sm:text-lg">
            Airport runs, day trips and intercity rides. Taxi for up to 4, minibus for
            up to 16 — the price is agreed before you get in, from €{fromPrice("pafos-airport")}.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/taxi"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              Taxi &amp; transfers
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <TaxiRatesDialog buttonClassName="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto" />
          </div>
        </div>
      </section>

      <Reviews />

      <Faq />
    </div>
  );
}

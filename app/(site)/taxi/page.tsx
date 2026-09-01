import Link from "next/link";
import { taxiServices, taxiVehicles, taxiLanguages } from "@/app/lib/placeholder-data";
import { taxiRoutes, taxiTiers, formatPrice } from "@/app/lib/taxi-data";
import { routeCopy } from "@/app/lib/seo-data";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import TaxiRatesDialog from "@/components/TaxiRatesDialog";

export const revalidate = 300;

export const metadata = {
  alternates: { canonical: "/taxi" },
  title: "Taxi & Minibus Transfers in Cyprus",
  description:
    "Fixed-price taxi and minibus transfers from Paphos to Pafos Airport, Larnaca Airport, Limassol, Nicosia and Ayia Napa. Taxi for up to 4, minibus for up to 16 — the price is agreed before you get in. English and Russian spoken.",
};

const included = [
  {
    title: "One fixed price, per vehicle",
    body: "The fare we quote is the fare you pay — one-way, for the whole car, whatever the traffic. No meter, no per-bag charge, no late-night rate.",
  },
  {
    title: "Door to door",
    body: "We collect you from your hotel, villa or the airport and take you straight to the address you give us. No shuttle, no extra stops unless you ask.",
  },
  {
    title: "Airport meet & greet",
    body: "Send us your flight number when you book. We follow the flight, so a delayed landing never costs you the transfer, and the driver is waiting in Arrivals.",
  },
  {
    title: "Everyone in one vehicle",
    body: "Taxi for up to 4 passengers, minibus for 5 to 16. Your group travels together with room for the luggage.",
  },
  {
    title: "Child seats on request",
    body: "Travelling with little ones? Tell us their ages when you book and we will fit the right seat at no rush.",
  },
  {
    title: "Return trips too",
    body: "Book both legs at once and we hold the pick-up time for your flight home — handy on airport day if you also rented a car from us.",
  },
];

export default function TaxiPage() {
  const firstTierKey = taxiTiers[0].key;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
        Taxi &amp; minibus
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Fixed-price transfers, anywhere in Cyprus
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        Airport runs, day trips and intercity rides. Taxi for up to 4 people,
        minibus for up to 16 — and the fare is agreed before you get in, so there
        is never a meter surprise at the end.
      </p>
      <p className="mt-2 text-sm font-medium text-slate-500">
        We speak {taxiLanguages.join(" & ")}.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/#booking?type=taxi"
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text sm:w-auto"
        >
          Request a taxi
        </Link>
        <TaxiRatesDialog buttonClassName="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {taxiVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-brand/60"
          >
            <div className="relative aspect-[4/3] w-full bg-slate-100">
              <FleetCarPhoto
                images={vehicle.images}
                name={vehicle.name}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">{vehicle.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{vehicle.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {taxiServices.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-brand/60 sm:p-6"
          >
            <h2 className="font-semibold text-slate-900">{service.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <p className="mt-4 text-sm font-semibold text-brand-text">{service.priceNote}</p>
          </div>
        ))}
      </div>

      {/* What's included */}
      <div className="mt-14 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          What every transfer includes
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="flex items-start gap-2 font-semibold text-slate-900">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-text"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m4 10 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular routes */}
      <div className="mt-14 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Popular routes from Paphos
          </h2>
          <p className="text-sm text-slate-500">
            One-way, per vehicle, for 1–4 people. Bigger groups &amp; every
            destination in the full price list.
          </p>
        </div>
        <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {taxiRoutes.map((route) => {
            const price = (
              <span className="font-semibold text-brand-text">
                from {formatPrice(route.prices[firstTierKey] ?? null)}
              </span>
            );
            const label = (
              <span className="font-medium text-slate-900">Paphos &rarr; {route.destination}</span>
            );
            // Routes with their own landing page link to it; the rest stay plain.
            return (
              <li key={route.id} className="text-sm">
                {routeCopy(route.id) ? (
                  <Link
                    href={`/taxi/${route.id}`}
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50 sm:px-5"
                  >
                    {label}
                    {price}
                  </Link>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3 sm:px-5">
                    {label}
                    {price}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-4">
          <TaxiRatesDialog
            buttonLabel="See the full price list"
            buttonClassName="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto"
          />
        </div>
      </div>

      {/* How booking works */}
      <div className="mt-14 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          How booking works
        </h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Tell us the trip",
              d: "Route, date, time and how many are travelling — plus your flight number for airport pick-ups.",
            },
            {
              n: "2",
              t: "We confirm the price",
              d: "You get the fixed fare and the pick-up time back by phone or WhatsApp, usually within the hour. No deposit.",
            },
            {
              n: "3",
              t: "Pay the driver",
              d: "Settle directly with the driver at the end of the trip. Ask us about card payment when we confirm.",
            },
          ].map((step) => (
            <li key={step.n} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-black">
                {step.n}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{step.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 rounded-2xl bg-slate-950 px-6 py-8 text-center text-white sm:mt-16 sm:px-10 sm:py-10">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Know your dates? Reserve your transfer now
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
          Tell us the route and how many are travelling. We confirm the fixed price
          and pick-up time by phone or WhatsApp — no deposit to book.
        </p>
        <Link
          href="/#booking?type=taxi"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base"
        >
          Book a transfer
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { taxiServices, taxiVehicles, taxiLanguages } from "@/app/lib/placeholder-data";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import TaxiRatesDialog from "@/components/TaxiRatesDialog";

export const revalidate = 300;

export const metadata = {
  title: "Taxi & Minibus Transfers in Cyprus",
  description:
    "Fixed-price taxi and minibus transfers from Paphos to Pafos Airport, Larnaca Airport, Limassol, Nicosia and Ayia Napa. Taxi for up to 4, minibus for up to 16 — the price is agreed before you get in. English and Russian spoken.",
};

export default function TaxiPage() {
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

      <div className="mt-12 rounded-2xl bg-slate-950 px-6 py-8 text-center text-white sm:px-10 sm:py-10">
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

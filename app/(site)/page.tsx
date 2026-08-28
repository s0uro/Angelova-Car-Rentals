import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import {
  taxiServices,
  taxiVehicles,
  taxiLanguages,
  pricingNotes,
} from "@/app/lib/placeholder-data";
import { fleet, rateTiers, formatRate } from "@/app/lib/fleet-data";
import { getActiveCarBookings, getBookedUntil } from "@/app/lib/availability";
import BookingForm from "@/components/BookingForm";
import TypewriterText from "@/components/TypewriterText";
import FleetCarousel from "@/components/FleetCarousel";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import TaxiRatesDialog from "@/components/TaxiRatesDialog";
import { taxiRoutes, taxiTiers, formatPrice } from "@/app/lib/taxi-data";

const heroStats = [
  { value: `${fleet.length}+`, label: "Cars in our fleet" },
  { value: "2", label: "Rental & taxi services" },
  { value: siteConfig.hours, label: "We're here when you need us" },
];

// Car availability changes with every reservation, so this page must be
// rendered per-request rather than statically prerendered at build time
// (which would freeze "unavailable" badges as of whenever the last deploy
// happened, and also makes the build fail if the DB isn't reachable then).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const activeBookings = await getActiveCarBookings();
  const bookedUntilByCarId = Object.fromEntries(
    fleet
      .map((car) => [car.id, getBookedUntil(activeBookings, car.name)] as const)
      .filter((entry): entry is [string, Date] => Boolean(entry[1]))
      .map(([id, until]) => [id, until.toISOString()])
  );
  const bookedRanges = activeBookings.map((b) => ({
    carName: b.carName,
    pickupDate: b.pickupDate.toISOString(),
    dropoffDate: b.dropoffDate.toISOString(),
  }));

  return (
    <div>
      <section id="home" className="relative -mt-24 flex min-h-screen scroll-mt-32 items-center overflow-hidden border-b border-slate-200 sm:-mt-28 sm:h-screen sm:min-h-0 lg:-mt-32">
        <video
          className="absolute inset-0 h-full w-full object-cover sm:hidden"
          src="/videos/background-mobile.mp4"
          poster="/videos/background-mobile-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <video
          className="absolute inset-0 hidden h-full w-full object-cover sm:block"
          src="/videos/background.mp4"
          poster="/videos/background-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 text-center lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-5xl">
              <TypewriterText text={siteConfig.name} />
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">
              {siteConfig.tagline} Choose from our rental fleet or book a taxi
              in just a few clicks.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                href="#fleet"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:border-brand hover:text-brand"
              >
                View our fleet
              </Link>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-lg grid-cols-3 divide-x divide-white/15 border-y border-white/15 sm:max-w-none lg:mx-0 lg:max-w-sm lg:grid-cols-1 lg:justify-self-end lg:divide-x-0 lg:divide-y">
            {heroStats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 text-center lg:px-0 lg:py-5 lg:text-left">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fleet" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
              Fan favorites
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              Our best rides, ready when you are
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              A look at our most-booked cars — from nimble city runs to
              family-sized comfort. Tap a car to see full details and rates.
            </p>
          </div>
          <Link
            href="/fleet"
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
          >
            View all fleet
          </Link>
        </div>

        <div className="mt-8">
          <FleetCarousel bookedUntilByCarId={bookedUntilByCarId} />
        </div>
      </section>

      <section id="taxi" className="scroll-mt-32 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Taxi Services
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Fast, reliable rides across the city and beyond. Request a taxi or
            minibus and we&apos;ll confirm your pickup details.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-500">
            We speak {taxiLanguages.join(", ")}.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {taxiVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="overflow-hidden rounded-lg border border-slate-200 transition-colors hover:border-brand/50"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  <FleetCarPhoto images={vehicle.images} name={vehicle.name} />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {vehicle.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {vehicle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {taxiServices.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-slate-200 p-6 transition-colors hover:border-brand/50"
              >
                <h3 className="font-semibold text-slate-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {service.description}
                </p>
                <p className="mt-4 text-sm font-medium text-brand-dark">
                  {service.priceNote}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#booking"
              className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
            >
              Request a taxi
            </Link>
            <TaxiRatesDialog buttonClassName="inline-block rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-32 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">Pricing</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            An overview of our car rental and taxi rates.
          </p>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-slate-900">Car rentals</h3>
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    {rateTiers.map((tier) => (
                      <th key={tier.key} className="px-4 py-3 font-medium">
                        {tier.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {fleet.map((car) => (
                    <tr key={car.id}>
                      <td className="px-4 py-3 text-slate-900">{car.name}</td>
                      {rateTiers.map((tier) => (
                        <td
                          key={tier.key}
                          className="px-4 py-3 font-medium text-brand-dark"
                        >
                          {formatRate(car.rates[tier.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Taxi &amp; minibus transfers</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Fixed prices per vehicle, one-way from Pafos. Taxi up to 4 people, minibus up to 16.
                </p>
              </div>
              <TaxiRatesDialog buttonClassName="shrink-0 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" />
            </div>
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Destination</th>
                    <th className="px-4 py-3 font-medium">Taxi ({taxiTiers[0].label})</th>
                    <th className="px-4 py-3 font-medium">Minibus ({taxiTiers[1].label})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {taxiRoutes.slice(0, 3).map((route) => (
                    <tr key={route.id}>
                      <td className="px-4 py-3 text-slate-900">{route.destination}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark">
                        {formatPrice(route.prices[taxiTiers[0].key])}
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-dark">
                        {formatPrice(route.prices[taxiTiers[1].key])}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-slate-500">
                      + {taxiRoutes.length - 3} more destinations and group sizes up to 16 — open the full price list above.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <ul className="mt-10 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {pricingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="booking" className="scroll-mt-32 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Book a Car or Taxi
          </h2>
          <p className="mt-2 text-slate-600">
            Fill out the form below and we&apos;ll confirm your reservation by
            phone or email.
          </p>
          <div className="mt-10">
            <BookingForm bookedRanges={bookedRanges} bookedUntilByCarId={bookedUntilByCarId} />
          </div>
        </div>
      </section>
    </div>
  );
}

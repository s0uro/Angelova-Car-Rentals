import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import {
  taxiServices,
  taxiVehicles,
  taxiLanguages,
  pricingNotes,
} from "@/app/lib/placeholder-data";
import { fleet, rateTiers, formatRate } from "@/app/lib/fleet-data";
import BookingForm from "@/components/BookingForm";
import TypewriterText from "@/components/TypewriterText";
import FleetCarousel from "@/components/FleetCarousel";
import FleetCarPhoto from "@/components/FleetCarPhoto";

const heroStats = [
  { value: `${fleet.length}+`, label: "Cars in our fleet" },
  { value: "2", label: "Rental & taxi services" },
  { value: siteConfig.hours, label: "We're here when you need us" },
];

export default function HomePage() {
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
            href="#fleet-full"
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
          >
            See the full fleet
          </Link>
        </div>

        <div className="mt-8">
          <FleetCarousel />
        </div>
      </section>

      <section id="fleet-full" className="scroll-mt-32 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Our Rental Fleet
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse our available cars and rates. Longer rentals get a lower
            daily rate — all rentals include basic insurance.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((car) => (
              <div
                key={car.id}
                id={car.id}
                className="scroll-mt-32 overflow-hidden rounded-lg border border-slate-200 transition-colors hover:border-brand/50"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  <FleetCarPhoto
                    images={car.images}
                    name={car.name}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {car.name}
                  </h3>
                  <dl className="mt-4 space-y-1 text-sm text-slate-600">
                    {rateTiers.map((tier) => (
                      <div key={tier.key} className="flex justify-between gap-2">
                        <dt className="text-slate-400">{tier.label}</dt>
                        <dd className="font-medium text-brand-dark">
                          {formatRate(car.rates[tier.key])}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href="#booking"
                    className="mt-4 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
                  >
                    Reserve this car
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

          <div className="mt-10">
            <Link
              href="#booking"
              className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
            >
              Request a taxi
            </Link>
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
            <h3 className="text-xl font-semibold text-slate-900">Taxi rates</h3>
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {taxiServices.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-3 text-slate-900">{service.name}</td>
                      <td className="px-4 py-3 font-medium text-brand-dark">
                        {service.priceNote}
                      </td>
                    </tr>
                  ))}
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
            <BookingForm />
          </div>
        </div>
      </section>
    </div>
  );
}

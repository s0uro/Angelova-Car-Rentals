import Link from "next/link";
import { fleet, rateTiers, formatRate } from "@/app/lib/fleet-data";
import FleetCarPhoto from "@/components/FleetCarPhoto";

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Our Rental Fleet</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Browse our available cars and rates. Longer rentals get a lower daily
        rate — all rentals include basic insurance.
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
              <h2 className="text-lg font-semibold text-slate-900">
                {car.name}
              </h2>
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
                href="/booking"
                className="mt-4 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
              >
                Reserve this car
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { fleet } from "@/app/lib/placeholder-data";

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Our Rental Fleet</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Browse our available cars. All rentals include basic insurance and
        24/7 roadside support.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fleet.map((car) => (
          <div key={car.id} className="rounded-lg border border-slate-200 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {car.category}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {car.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{car.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>
                <dt className="text-slate-400">Seats</dt>
                <dd>{car.seats}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Transmission</dt>
                <dd>{car.transmission}</dd>
              </div>
            </dl>
            <p className="mt-4 text-base font-semibold text-brand-dark">
              €{car.pricePerDay}/day
            </p>
            <Link
              href="/booking"
              className="mt-4 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-black hover:bg-brand-dark"
            >
              Reserve this car
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

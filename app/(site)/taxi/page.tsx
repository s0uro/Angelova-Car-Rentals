import Link from "next/link";
import {
  taxiServices,
  taxiVehicles,
  taxiLanguages,
} from "@/app/lib/placeholder-data";
import FleetCarPhoto from "@/components/FleetCarPhoto";

export default function TaxiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Taxi Services</h1>
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
              <h2 className="text-lg font-semibold text-slate-900">
                {vehicle.name}
              </h2>
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
            <h2 className="text-lg font-semibold text-slate-900">
              {service.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <p className="mt-4 text-sm font-semibold text-brand-dark">
              {service.priceNote}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/booking"
          className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
        >
          Request a taxi
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import { rateTiers, formatRate, type FleetCar } from "@/app/lib/fleet-data";
import { formatDate } from "@/app/lib/timezone";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default function FleetCard({
  car,
  bookedUntil,
  href,
  priority = false,
  sizes,
  showAllRates = false,
}: {
  car: FleetCar;
  bookedUntil?: string | Date | null;
  href: string;
  priority?: boolean;
  sizes?: string;
  showAllRates?: boolean;
}) {
  return (
    <article
      id={car.id}
      className="group flex scroll-mt-32 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-brand/60"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <FleetCarPhoto
          images={car.images}
          name={car.name}
          priority={priority}
          sizes={sizes}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          {car.category}
        </span>
        {bookedUntil && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Booked until {formatDate(bookedUntil)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{car.name}</h3>
          <p className="shrink-0 text-right">
            <span className="block text-[11px] uppercase tracking-wide text-slate-400">from</span>
            <span className="text-lg font-bold text-brand-text">
              {formatRate(car.rates.oneDay)}
              <span className="text-xs font-medium text-slate-500">/day</span>
            </span>
          </p>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 border-y border-slate-100 py-3">
          <Spec label="Seats" value={String(car.seats)} />
          <Spec label="Gearbox" value={car.transmission === "Automatic" ? "Auto" : "Manual"} />
          <Spec label="Fuel" value={car.fuel} />
          <Spec label="Bags" value={String(car.bags)} />
        </div>

        {showAllRates && (
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer list-none text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline">
              All rates ▾
            </summary>
            <dl className="mt-2 space-y-1">
              {rateTiers.map((tier) => (
                <div key={tier.key} className="flex justify-between gap-2">
                  <dt className="text-slate-500">{tier.label}</dt>
                  <dd className="font-medium text-brand-text">{formatRate(car.rates[tier.key])}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}

        <Link
          href={href}
          className="mt-4 inline-block rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          {car.ac ? "Reserve · A/C included" : "Reserve this car"}
        </Link>
      </div>
    </article>
  );
}

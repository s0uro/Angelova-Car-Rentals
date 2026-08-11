import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import { fleet, taxiServices } from "@/app/lib/placeholder-data";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            {siteConfig.tagline} Choose from our rental fleet or book a taxi
            in just a few clicks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-dark"
            >
              Book a car or taxi
            </Link>
            <Link
              href="/fleet"
              className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              View our fleet
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">Our fleet</h2>
        <p className="mt-2 text-slate-600">
          A range of vehicles for every trip, from city runs to family
          holidays.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map((car) => (
            <div
              key={car.id}
              className="rounded-lg border border-slate-200 p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {car.category}
              </p>
              <h3 className="mt-1 font-semibold text-slate-900">{car.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{car.description}</p>
              <p className="mt-4 text-sm font-semibold text-brand-dark">
                €{car.pricePerDay}/day
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Taxi services
          </h2>
          <p className="mt-2 text-slate-600">
            Need a ride instead? We&apos;ve got you covered.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {taxiServices.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-slate-200 p-5"
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
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import { fleet, rateTiers, formatRate } from "@/app/lib/fleet-data";
import { siteConfig } from "@/app/lib/site-config";

// One page per car, so searches like "rent a Nissan March in Paphos" have
// something to land on instead of the whole fleet list.
export function generateStaticParams() {
  return fleet.map((car) => ({ car: car.id }));
}

function carById(id: string) {
  return fleet.find((c) => c.id === id);
}

export async function generateMetadata({ params }: { params: Promise<{ car: string }> }) {
  const { car: id } = await params;
  const car = carById(id);
  if (!car) return {};
  const from = formatRate(car.rates.oneDay);
  return {
    title: `Rent a ${car.name} in Paphos — from ${from}/day`,
    description: `Hire a ${car.name} in Paphos, Cyprus from ${from} a day. ${car.seats} seats, ${car.transmission.toLowerCase()} gearbox, ${car.fuel.toLowerCase()}, ${car.bags} bags, air conditioning and basic insurance included. Free delivery to Pafos Airport, your hotel or villa.`,
    alternates: { canonical: `/fleet/${car.id}` },
    openGraph: {
      title: `Rent a ${car.name} in Paphos — from ${from}/day`,
      url: `${siteConfig.url}/fleet/${car.id}`,
      images: car.images.length ? [car.images[0]] : undefined,
    },
  };
}

export default async function CarPage({ params }: { params: Promise<{ car: string }> }) {
  const { car: id } = await params;
  const car = carById(id);
  if (!car) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    url: `${siteConfig.url}/fleet/${car.id}`,
    image: car.images.map((src) => `${siteConfig.url}${src}`),
    vehicleSeatingCapacity: car.seats,
    vehicleTransmission: car.transmission,
    fuelType: car.fuel,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: car.rates.oneDay,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: car.rates.oneDay,
        priceCurrency: "EUR",
        unitText: "DAY",
      },
      seller: { "@id": `${siteConfig.url}/#rental` },
    },
  };

  const specs = [
    { label: "Category", value: car.category },
    { label: "Seats", value: String(car.seats) },
    { label: "Gearbox", value: car.transmission },
    { label: "Fuel", value: car.fuel },
    { label: "Bags", value: String(car.bags) },
    { label: "Air conditioning", value: car.ac ? "Yes" : "No" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/fleet" className="hover:text-brand-text hover:underline">
          Fleet
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-slate-700">{car.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <FleetCarPhoto
            images={car.images}
            name={car.name}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Rent a {car.name} in Paphos
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            From <span className="font-bold text-brand-text">{formatRate(car.rates.oneDay)}</span> a
            day, with A/C and basic insurance included. We deliver free to Pafos Airport, your
            hotel or your villa.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 border-y border-slate-200 py-4 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{spec.label}</dt>
                <dd className="text-sm font-medium text-slate-800">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-6 text-lg font-semibold text-slate-900">Daily rates</h2>
          <dl className="mt-2 space-y-1 text-sm">
            {rateTiers.map((tier) => (
              <div key={tier.key} className="flex justify-between gap-2">
                <dt className="text-slate-500">{tier.label}</dt>
                <dd className="font-medium text-brand-text">{formatRate(car.rates[tier.key])}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={`/#booking?car=${encodeURIComponent(car.name)}`}
            className="mt-7 inline-block w-full rounded-md bg-brand px-6 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:w-auto"
          >
            Reserve this car
          </Link>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-900">Other cars in our fleet</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {fleet
            .filter((c) => c.id !== car.id)
            .map((c) => (
              <li key={c.id}>
                <Link
                  href={`/fleet/${c.id}`}
                  className="inline-block rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition-colors hover:border-brand hover:text-brand-text"
                >
                  {c.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

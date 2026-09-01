import Link from "next/link";
import { notFound } from "next/navigation";
import {
  taxiRoutes,
  taxiTiers,
  formatPrice,
  type TaxiRoute,
} from "@/app/lib/taxi-data";
import { routeCopy, sharedTransferFaqs, formatDuration } from "@/app/lib/seo-data";
import { siteConfig } from "@/app/lib/site-config";

// A page per transfer route. "Paphos to Larnaca airport taxi price" is the way
// people actually search for this, and a single /taxi price table can't rank
// for eight destinations at once.
export function generateStaticParams() {
  return taxiRoutes.filter((r) => routeCopy(r.id)).map((r) => ({ route: r.id }));
}

function routeById(id: string): TaxiRoute | undefined {
  return taxiRoutes.find((r) => r.id === id);
}

function fromFare(route: TaxiRoute) {
  return route.prices[taxiTiers[0].key] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ route: string }> }) {
  const { route: id } = await params;
  const route = routeById(id);
  const copy = routeCopy(id);
  if (!route || !copy) return {};
  const from = formatPrice(fromFare(route));
  return {
    title: `Pafos to ${route.destination} Taxi & Minibus — fixed fare from ${from}`,
    description: `Fixed-price transfer from Pafos to ${route.destination}: ${from} for 1–4 people, minibuses up to ${taxiTiers[taxiTiers.length - 1].maxPax}. About ${formatDuration(copy.approxMinutes)}. No deposit — we confirm by phone or WhatsApp.`,
    alternates: { canonical: `/taxi/${id}` },
    openGraph: {
      title: `Pafos to ${route.destination} — fixed-price transfer from ${from}`,
      url: `${siteConfig.url}/taxi/${id}`,
      // Without this the page inherits no image at all: declaring openGraph
      // here replaces the root file-based opengraph-image.
      images: [`${siteConfig.url}/opengraph-image`],
    },
  };
}

export default async function TransferRoutePage({
  params,
}: {
  params: Promise<{ route: string }>;
}) {
  const { route: id } = await params;
  const route = routeById(id);
  const copy = routeCopy(id);
  if (!route || !copy) notFound();

  const from = fromFare(route);
  const url = `${siteConfig.url}/taxi/${id}`;

  const faqs = [
    {
      q: `How much is a taxi from Pafos to ${route.destination}?`,
      a: `${formatPrice(from)} for 1–4 people, one way, for the whole vehicle. Larger groups travel by minibus — see the table above for every group size.`,
    },
    {
      q: `How long does the transfer to ${route.destination} take?`,
      a: `About ${formatDuration(copy.approxMinutes)}, roughly ${copy.approxKm} km, traffic permitting.`,
    },
    ...sharedTransferFaqs,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Pafos to ${route.destination} taxi & minibus transfer`,
        serviceType: "Airport and intercity transfer",
        provider: { "@id": `${siteConfig.url}/#rental` },
        areaServed: [{ "@type": "Place", name: "Pafos" }, { "@type": "Place", name: route.destination }],
        url,
        offers: taxiTiers
          .filter((tier) => route.prices[tier.key] != null)
          .map((tier) => ({
            "@type": "Offer",
            name: `${tier.vehicle}, ${tier.label} people`,
            price: route.prices[tier.key],
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Taxi & transfers", item: `${siteConfig.url}/taxi` },
          { "@type": "ListItem", position: 2, name: route.destination, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const others = taxiRoutes.filter((r) => r.id !== route.id && routeCopy(r.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/taxi" className="hover:text-brand-text hover:underline">
          Taxi &amp; transfers
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-slate-700">{route.destination}</span>
      </nav>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-text">
        Fixed-price transfer
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Pafos to {route.destination} by taxi or minibus
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">{copy.intro}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-200 py-4 sm:grid-cols-4">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">From</dt>
          <dd className="text-lg font-bold text-brand-text">{formatPrice(from)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Journey</dt>
          <dd className="text-sm font-medium text-slate-800">
            about {formatDuration(copy.approxMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Distance</dt>
          <dd className="text-sm font-medium text-slate-800">about {copy.approxKm} km</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-400">Deposit</dt>
          <dd className="text-sm font-medium text-slate-800">None</dd>
        </div>
      </dl>

      <ul className="mt-5 space-y-2">
        {copy.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-slate-700">
            <span aria-hidden="true" className="mt-1 text-brand-text">
              ✓
            </span>
            {h}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">
        Price by group size — Pafos to {route.destination}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Per vehicle, one way. The same fare applies in the other direction.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[380px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th scope="col" className="py-2 pr-4 font-medium">
                People
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Vehicle
              </th>
              <th scope="col" className="py-2 font-medium">
                Fixed fare
              </th>
            </tr>
          </thead>
          <tbody>
            {taxiTiers.map((tier) => (
              <tr key={tier.key} className="border-b border-slate-100">
                <td className="py-2 pr-4 text-slate-700">{tier.label}</td>
                <td className="py-2 pr-4 text-slate-500">{tier.vehicle}</td>
                <td className="py-2 font-semibold text-brand-text">
                  {formatPrice(route.prices[tier.key] ?? null)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        href={`/#booking?type=taxi&to=${encodeURIComponent(route.destination)}`}
        className="mt-7 inline-block w-full rounded-md bg-brand px-6 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:w-auto"
      >
        Book this transfer
      </Link>

      <h2 className="mt-12 text-xl font-semibold text-slate-900">Questions about this route</h2>
      <dl className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((f) => (
          <div key={f.q} className="py-4">
            <dt className="font-medium text-slate-900">{f.q}</dt>
            <dd className="mt-1 text-slate-600">{f.a}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Other transfers from Pafos</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {others.map((r) => (
          <li key={r.id}>
            <Link
              href={`/taxi/${r.id}`}
              className="inline-block rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition-colors hover:border-brand hover:text-brand-text"
            >
              {r.destination} — {formatPrice(fromFare(r))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

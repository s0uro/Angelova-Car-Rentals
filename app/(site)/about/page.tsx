import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";

export const metadata = {
  title: "About Us",
  description:
    "Angelova Car Rentals is a family-run car rental and taxi service in Paphos, Cyprus. We know the island, we answer the phone ourselves, and we meet you at the airport with the keys.",
};

const values = [
  {
    title: "You deal with the family, not a call centre",
    body: "The person who picks up the phone is the person who hands you the keys. Every booking is read, replied to and confirmed by us personally.",
  },
  {
    title: "We actually live here",
    body: "Ask us where to eat in the old town, which beach is calm for the kids, or the quickest way to Tombs of the Kings. Local advice comes with the car.",
  },
  {
    title: "One honest price",
    body: "The rate you see includes A/C and basic insurance. Transfers are fixed and agreed before you travel. No counter upsells, no meter surprises.",
  },
  {
    title: "English & Russian, spoken properly",
    body: "Book, ask questions and sort out any change of plan in the language you are comfortable in.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
        About us
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        A family-run car rental &amp; taxi service in Paphos
      </h1>

      <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
        <p>
          {siteConfig.shortName} is a small, family-run business based in Neapolis,
          Paphos. We rent cars and drive people around Cyprus — and we have built
          the whole service around the way we would want to be treated on holiday:
          met on arrival, given a fair price, and looked after if plans change.
        </p>
        <p>
          There is no fleet of desks and no queue. You tell us your dates and where
          you are staying, we bring the car to Pafos Airport, your hotel or your
          villa, and we are one phone call away for the rest of your trip. On airport
          day, leave the car with us and let us do the driving.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {values.map((v) => (
          <div
            key={v.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Where to find us</h2>
        <dl className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-slate-900">Address</dt>
            <dd>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-text hover:underline"
              >
                {siteConfig.address}
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-slate-900">Hours</dt>
            <dd>{siteConfig.hours}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-slate-900">Phone</dt>
            <dd className="flex flex-wrap gap-x-3">
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="hover:text-brand-text hover:underline">
                {siteConfig.phone}
              </a>
              <a href={`tel:${siteConfig.phone2.replace(/\s+/g, "")}`} className="hover:text-brand-text hover:underline">
                {siteConfig.phone2}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/#booking"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text sm:w-auto sm:text-base"
        >
          Book your car
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          href="/fleet"
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand-text sm:w-auto sm:text-base"
        >
          See the fleet
        </Link>
      </div>
    </div>
  );
}

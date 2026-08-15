import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import { taxiServices } from "@/app/lib/placeholder-data";
import { fleet } from "@/app/lib/fleet-data";
import BookingForm from "@/components/BookingForm";
import TypewriterText from "@/components/TypewriterText";
import FleetCarousel from "@/components/FleetCarousel";

const heroStats = [
  {
    value: `${fleet.length}+`,
    label: "Cars in our fleet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path
          d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13M4 13h16v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: "2",
    label: "Rental & taxi services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path
          d="M4 19h16M6 19V9l6-5 6 5v10M10 19v-6h4v6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: siteConfig.hours,
    label: "We're here when you need us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
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

          <div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-3 lg:mx-0 lg:max-w-sm lg:grid-cols-1 lg:justify-self-end">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 backdrop-blur-sm lg:justify-start"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                  {stat.icon}
                </span>
                <div className="text-left">
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-300">{stat.label}</p>
                </div>
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
            See the full fleet
          </Link>
        </div>

        <div className="mt-8">
          <FleetCarousel />
        </div>

        <div className="mx-auto mt-14 max-w-lg">
          <BookingForm />
        </div>
      </section>

      <section id="services" className="scroll-mt-32 border-t border-slate-200 bg-white">
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
        </div>
      </section>
    </div>
  );
}

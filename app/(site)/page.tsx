import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import { taxiServices } from "@/app/lib/placeholder-data";
import BookingForm from "@/components/BookingForm";
import TypewriterText from "@/components/TypewriterText";
import FleetCarousel from "@/components/FleetCarousel";

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

          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:mt-28 lg:justify-self-end lg:self-end">
            <BookingForm compact />
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

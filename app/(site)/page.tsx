import Link from "next/link";
import { taxiServices, taxiVehicles, taxiLanguages } from "@/app/lib/placeholder-data";
import { fleet, fromDailyRate } from "@/app/lib/fleet-data";
import { getActiveCarBookings, getBookedUntil } from "@/app/lib/availability";
import BookingForm from "@/components/BookingForm";
import TypewriterText from "@/components/TypewriterText";
import FleetCarousel from "@/components/FleetCarousel";
import Reviews from "@/components/Reviews";
import FleetCarPhoto from "@/components/FleetCarPhoto";
import HeroVideo from "@/components/HeroVideo";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import TaxiRatesDialog from "@/components/TaxiRatesDialog";
import { fromPrice } from "@/app/lib/taxi-data";

const whyUs = [
  { title: "We bring the car to you", body: "Airport, hotel or villa — no queue, no shuttle bus." },
  { title: "One price, no surprises", body: "A/C and basic insurance included in every rate you see." },
  { title: "English & Russian", body: "Talk to us in the language you are comfortable in." },
  { title: "Cars and taxis together", body: "Rent for the week, and let us drive you on airport day." },
];

// Availability badges change with every reservation. The page is cached and
// revalidated on demand (createReservation / status changes call
// revalidatePath) with a 5-minute safety net, instead of hitting the DB on
// every visit.
export const revalidate = 300;

const heroSubline = `Cars from €${fromDailyRate} a day · Pafos Airport transfers from €${fromPrice("pafos-airport")} · English & Russian spoken`;

export default async function HomePage() {
  const activeBookings = await getActiveCarBookings();
  const bookedUntilByCarId = Object.fromEntries(
    fleet
      .map((car) => [car.id, getBookedUntil(activeBookings, car.name)] as const)
      .filter((entry): entry is [string, Date] => Boolean(entry[1]))
      .map(([id, until]) => [id, until.toISOString()])
  );
  const bookedRanges = activeBookings.map((b) => ({
    carName: b.carName,
    pickupDate: b.pickupDate.toISOString(),
    dropoffDate: b.dropoffDate.toISOString(),
  }));

  return (
    <div>
      <JsonLd />
      <section id="home" className="relative -mt-24 flex min-h-screen scroll-mt-32 items-center border-b border-slate-200 py-10 sm:-mt-28 sm:py-16 lg:-mt-32">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-6 text-center lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Car rental &amp; taxi
              <span className="block text-brand">in Paphos</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
              <TypewriterText text={heroSubline} />
            </p>

            <p className="mt-4 text-sm text-slate-300">
              Free delivery to Pafos Airport, your hotel or villa.
            </p>
          </div>

          <div id="booking" className="mx-auto w-full max-w-md scroll-mt-32 lg:mx-0 lg:max-w-sm lg:justify-self-end">
            <BookingForm bookedRanges={bookedRanges} bookedUntilByCarId={bookedUntilByCarId} compact />
          </div>
        </div>
      </section>

      <section id="fleet" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
              Most booked
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Our best rides, ready when you are
            </h2>
            <p className="mt-2 max-w-xl text-lg text-slate-600">
              From nimble city runs to seven seats for the whole family. Every car is
              air-conditioned with basic insurance included.
            </p>
          </div>
          <Link
            href="/fleet"
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
          >
            View all fleet
          </Link>
        </div>

        <div className="mt-8">
          <FleetCarousel bookedUntilByCarId={bookedUntilByCarId} />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => (
            <div
              key={item.title}
              className="rounded-full bg-white px-6 py-6 text-center shadow-sm ring-1 ring-slate-200 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left sm:shadow-none sm:ring-0"
            >
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="taxi" className="scroll-mt-32 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Taxi &amp; minibus
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Fixed-price transfers, anywhere in Cyprus
          </h2>
          <p className="mt-2 max-w-2xl text-lg text-slate-300">
            Airport runs, day trips and intercity rides. Taxi for up to 4, minibus for
            up to 16 — the price is agreed before you get in.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-400">
            We speak {taxiLanguages.join(", ")}.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {taxiVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="overflow-hidden rounded-xl border border-white/15 bg-white/5 transition-colors hover:border-brand/60"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-800">
                  <FleetCarPhoto
                    images={vehicle.images}
                    name={vehicle.name}
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">{vehicle.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{vehicle.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {taxiServices.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-white/15 bg-white/5 p-6 transition-colors hover:border-brand/60"
              >
                <h3 className="font-semibold text-white">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{service.description}</p>
                <p className="mt-4 text-sm font-semibold text-brand">{service.priceNote}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#booking"
              className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
            >
              Request a taxi
            </Link>
            <TaxiRatesDialog buttonClassName="inline-block rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" />
          </div>
        </div>
      </section>

      <Reviews />

      <Faq />
    </div>
  );
}

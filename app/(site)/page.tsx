import { siteConfig } from "@/app/lib/site-config";
import { fleet, taxiServices } from "@/app/lib/placeholder-data";
import BookingForm from "@/components/BookingForm";

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

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            {siteConfig.tagline} Choose from our rental fleet or book a taxi
            in just a few clicks.
          </p>

          <div className="mx-auto mt-10 w-full max-w-4xl">
            <BookingForm />
          </div>
        </div>
      </section>

      <section id="fleet" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-16">
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

import { fleet } from "@/app/lib/fleet-data";
import { getActiveCarBookings, getBookedUntil } from "@/app/lib/availability";
import FleetGrid from "@/components/FleetGrid";

// See app/(site)/page.tsx: cached, revalidated on demand when bookings change.
export const revalidate = 300;

export const metadata = {
  title: "Our Rental Fleet & Prices",
  description:
    "Every car in the Angelova fleet in Paphos with seats, gearbox, fuel and daily rates from 1 day to 14+ days. All rentals include A/C and basic insurance.",
};

export default async function FleetPage() {
  const activeBookings = await getActiveCarBookings();
  const bookedUntilByCarId = Object.fromEntries(
    fleet
      .map((car) => [car.id, getBookedUntil(activeBookings, car.name)] as const)
      .filter((entry): entry is [string, Date] => Boolean(entry[1]))
      .map(([id, until]) => [id, until.toISOString()])
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">
        {fleet.length} cars, one price list
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Our rental fleet
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-slate-600">
        Every car is automatic unless noted, air-conditioned and comes with basic insurance.
        The longer you rent, the lower the daily rate.
      </p>

      <FleetGrid bookedUntilByCarId={bookedUntilByCarId} />
    </div>
  );
}

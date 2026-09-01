import { fleet } from "@/app/lib/fleet-data";
import FleetGrid from "@/components/FleetGrid";

export const metadata = {
  alternates: { canonical: "/fleet" },
  title: "Our Rental Fleet & Prices",
  description:
    "Every car in the Angelova fleet in Paphos with seats, gearbox, fuel and daily rates from 1 day to 14+ days. All rentals include A/C and basic insurance.",
};

export default function FleetPage() {
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

      <FleetGrid />
    </div>
  );
}

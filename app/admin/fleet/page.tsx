import Image from "next/image";
import { verifySession } from "@/app/lib/dal";
import { allCars, fleet } from "@/app/lib/fleet-data";
import { loadActiveCarBookings, loadCarQuantities, unitsOf } from "@/app/lib/availability";
import CarQuantityControl from "@/components/CarQuantityControl";

export const metadata = { title: "Fleet" };

export default async function FleetAdminPage() {
  await verifySession();
  const [quantities, bookings] = await Promise.all([loadCarQuantities(), loadActiveCarBookings()]);
  const now = new Date();
  const bookedNow = (carName: string) =>
    bookings.filter((b) => b.carName === carName && b.pickupDate <= now && now < b.dropoffDate).length;
  const retired = allCars.filter((car) => !car.active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Fleet</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        How many cars of each model you have. A model stays bookable for any dates until every
        unit is booked (pending or accepted) at the same time. Set 0 to stop bookings of a model
        for now.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Car</th>
              <th className="px-4 py-3 font-medium">Booked now</th>
              <th className="px-4 py-3 font-medium">Units in fleet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {fleet.map((car) => {
              const units = unitsOf(quantities, car.name);
              const out = bookedNow(car.name);
              return (
                <tr key={car.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {car.images[0] && (
                        <Image
                          src={car.images[0]}
                          alt=""
                          width={80}
                          height={60}
                          className="h-12 w-16 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{car.name}</div>
                        <div className="text-xs text-slate-500">
                          {car.category} · {car.transmission}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 ${out >= units ? "font-semibold text-red-700" : "text-slate-700"}`}>
                    {out} of {units}
                  </td>
                  <td className="px-4 py-3">
                    <CarQuantityControl carName={car.name} quantity={units} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {retired.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">
          No longer for rent (hidden from the site, old bookings unaffected):{" "}
          {retired.map((car) => car.name).join(", ")}.
        </p>
      )}
    </div>
  );
}

import type { Reservation } from "@/app/generated/prisma/client";
import ReservationStatusControl from "@/components/ReservationStatusControl";
import { formatDateTime } from "@/app/lib/timezone";

export default function ReservationsTable({
  reservations,
}: {
  reservations: Reservation[];
}) {
  if (reservations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No reservations yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Car</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Age</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Pickup</th>
            <th className="px-4 py-3 font-medium">Drop-off</th>
            <th className="px-4 py-3 font-medium">Locations</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="px-4 py-3 capitalize text-slate-900">
                {reservation.type}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {reservation.carName ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-900">
                {reservation.name} {reservation.surname}
              </td>
              <td className="px-4 py-3 text-slate-600">{reservation.age}</td>
              <td className="px-4 py-3 text-slate-600">
                <div>{reservation.phone}</div>
                {reservation.email && (
                  <div className="text-slate-400">{reservation.email}</div>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDateTime(reservation.pickupDate)}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDateTime(reservation.dropoffDate)}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <div>{reservation.pickupLocation}</div>
                {reservation.dropoffLocation && (
                  <div className="text-slate-400">
                    → {reservation.dropoffLocation}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <ReservationStatusControl
                  id={reservation.id}
                  status={reservation.status}
                />
              </td>
              <td className="px-4 py-3 text-slate-500">
                {formatDateTime(reservation.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

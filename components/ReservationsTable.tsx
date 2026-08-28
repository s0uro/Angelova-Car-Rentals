import Link from "next/link";
import type { Reservation } from "@/app/generated/prisma/client";
import ReservationStatusControl from "@/components/ReservationStatusControl";
import { formatDateTime, formatDate } from "@/app/lib/timezone";
import { referenceOf } from "@/app/lib/admin/reference";

function whatLabel(r: Reservation) {
  if (r.type === "taxi") {
    return `Taxi${r.passengers ? ` · ${r.passengers} pax` : ""}`;
  }
  return r.carName ?? "Car";
}

function routeLabel(r: Reservation) {
  return r.dropoffLocation ? `${r.pickupLocation} → ${r.dropoffLocation}` : r.pickupLocation;
}

function whenLabel(r: Reservation) {
  return r.dropoffDate
    ? `${formatDateTime(r.pickupDate)} → ${formatDateTime(r.dropoffDate)}`
    : formatDateTime(r.pickupDate);
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default function ReservationsTable({
  reservations,
  emptyHint = "No reservations yet.",
}: {
  reservations: Reservation[];
  emptyHint?: string;
}) {
  if (reservations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        {emptyHint}
      </p>
    );
  }

  return (
    <>
      {/* Mobile: cards */}
      <ul className="space-y-3 md:hidden">
        {reservations.map((r) => (
          <li key={r.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/admin/reservations/${r.id}`} className="font-semibold text-slate-900 hover:underline">
                  {r.name} {r.surname}
                </Link>
                <p className="text-xs text-slate-500">
                  #{referenceOf(r.id)} · {whatLabel(r)}
                  {r.contactedAt && " · ☎ contacted"}
                </p>
              </div>
              <ReservationStatusControl id={r.id} status={r.status} />
            </div>
            <p className="mt-2 text-sm text-slate-700">{whenLabel(r)}</p>
            <p className="text-sm text-slate-500">{routeLabel(r)}</p>
            <div className="mt-3 flex gap-2 text-sm">
              <a href={telHref(r.phone)} className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-800 hover:border-brand">
                Call
              </a>
              <a
                href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-800 hover:border-[#25D366]"
              >
                WhatsApp
              </a>
              <Link href={`/admin/reservations/${r.id}`} className="ml-auto rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800">
                Details
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">What</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  <Link href={`/admin/reservations/${r.id}`} className="hover:underline">
                    {referenceOf(r.id)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <div>{formatDateTime(r.pickupDate)}</div>
                  {r.dropoffDate && <div className="text-slate-400">→ {formatDateTime(r.dropoffDate)}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-900">{whatLabel(r)}</div>
                  <div className="text-slate-400">{routeLabel(r)}</div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/reservations/${r.id}`} className="font-medium text-slate-900 hover:underline">
                    {r.name} {r.surname}
                  </Link>
                  <div className="flex items-center gap-2 text-slate-500">
                    <a href={telHref(r.phone)} className="hover:text-slate-900">{r.phone}</a>
                    <a
                      href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="text-[#25D366] hover:opacity-80"
                    >
                      ●
                    </a>
                    {r.contactedAt && (
                      <span title={`Contacted ${formatDate(r.contactedAt)}`} className="text-xs text-emerald-700">
                        ☎ contacted
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ReservationStatusControl id={r.id} status={r.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDateTime(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

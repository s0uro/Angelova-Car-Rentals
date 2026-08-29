import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { verifySession } from "@/app/lib/dal";
import {
  getReservation,
  customerHistory,
  overlappingBookings,
  referenceOf,
} from "@/app/lib/admin/reservations";
import { fleet, formatRate } from "@/app/lib/fleet-data";
import { quoteRental } from "@/app/lib/pricing";
import { getTransferPrice, tierForPassengers, formatPrice } from "@/app/lib/taxi-data";
import { formatDate, formatDateTime } from "@/app/lib/timezone";
import { STATUS_LABELS, type ReservationStatus } from "@/app/lib/reservation-status";
import { siteConfig } from "@/app/lib/site-config";
import ReservationStatusControl from "@/components/ReservationStatusControl";
import AdminNotes from "@/components/AdminNotes";
import CopyButton from "@/components/CopyButton";

export const metadata = { title: "Reservation" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900">{children}</dd>
    </div>
  );
}

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const r = await getReservation(id);
  if (!r) notFound();

  const [history, overlaps] = await Promise.all([
    customerHistory(r.phone, r.id),
    overlappingBookings(r),
  ]);

  const ref = referenceOf(r.id);
  const isTaxi = r.type === "taxi";
  const estimate = !isTaxi && r.carName ? quoteRental(r.carName, r.pickupDate, r.dropoffDate) : null;
  const taxiTier = isTaxi && r.passengers ? tierForPassengers(r.passengers) : null;
  const taxiPrice =
    isTaxi && r.passengers && r.dropoffLocation ? getTransferPrice(r.dropoffLocation, r.passengers) : null;
  const car = !isTaxi ? fleet.find((c) => c.name === r.carName) : undefined;
  const phoneDigits = r.phone.replace(/\D/g, "");

  const whenText = r.dropoffDate
    ? `${formatDateTime(r.pickupDate)} → ${formatDateTime(r.dropoffDate)}`
    : formatDateTime(r.pickupDate);
  const whatText = isTaxi
    ? `${taxiTier?.vehicle ?? "Taxi"} for ${r.passengers ?? "?"} · ${r.pickupLocation} → ${r.dropoffLocation ?? "?"}`
    : `${r.carName} · pickup ${r.pickupLocation}${r.dropoffLocation ? ` → ${r.dropoffLocation}` : ""}`;
  const priceText = isTaxi
    ? taxiPrice !== null ? `Fixed price ${formatPrice(taxiPrice)}` : "Price to confirm"
    : estimate?.total != null ? `Estimated ${formatRate(estimate.total)} (${estimate.days} days)` : "Price to confirm";
  const summary = `Booking ${ref}\n${r.name} ${r.surname} · ${r.phone}${r.email ? ` · ${r.email}` : ""}\n${whatText}\n${whenText}\n${priceText}${r.notes ? `\nCustomer notes: ${r.notes}` : ""}`;

  const waText = encodeURIComponent(
    `Hello ${r.name}, this is ${siteConfig.shortName} about your booking ${ref} for ${formatDate(r.pickupDate)}. `
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/admin/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
        ← All reservations
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-slate-500">#{ref}</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {r.name} {r.surname}
          </h1>
          <p className="text-sm text-slate-600">{whatText}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ReservationStatusControl id={r.id} status={r.status} />
          <a
            href={`https://wa.me/${phoneDigits}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#25D366] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Call {r.phone}
          </a>
          <CopyButton text={summary} />
        </div>
      </div>

      {overlaps.length > 0 && (
        <div role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Double booking! {r.carName} is also reserved for overlapping dates:</p>
          <ul className="mt-1 list-disc pl-5">
            {overlaps.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/reservations/${o.id}`} className="underline">
                  #{referenceOf(o.id)} {o.name} {o.surname}
                </Link>{" "}
                — {formatDateTime(o.pickupDate)} → {o.dropoffDate ? formatDateTime(o.dropoffDate) : "open"} (
                {STATUS_LABELS[o.status as ReservationStatus] ?? o.status})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Trip</h2>
            <dl className="mt-2 divide-y divide-slate-100">
              <Row label="Service">{isTaxi ? `Taxi / ${taxiTier?.vehicle ?? "—"}` : "Car rental"}</Row>
              {isTaxi ? (
                <Row label="Passengers">{r.passengers ?? "—"}</Row>
              ) : (
                <Row label="Car">
                  <div className="flex items-center gap-3">
                    {car?.images[0] && (
                      <Image src={car.images[0]} alt="" width={96} height={72} className="h-14 w-20 rounded object-cover" />
                    )}
                    <span>{r.carName ?? "—"}</span>
                  </div>
                </Row>
              )}
              <Row label="Pickup">{formatDateTime(r.pickupDate)} · {r.pickupLocation}</Row>
              <Row label={isTaxi ? "Destination" : "Drop-off"}>
                {isTaxi
                  ? r.dropoffLocation ?? "—"
                  : `${formatDateTime(r.dropoffDate)}${r.dropoffLocation ? ` · ${r.dropoffLocation}` : ""}`}
              </Row>
              <Row label="Price">
                <span className="font-semibold text-brand-text">{priceText}</span>
                {!isTaxi && estimate && (
                  <span className="ml-2 text-xs text-slate-500">
                    {estimate.days === 1
                      ? `1 day @ ${formatRate(estimate.car.rates.oneDay)}`
                      : `${estimate.days} days · tiered daily rate`}
                  </span>
                )}
              </Row>
              <Row label="Customer notes">{r.notes ? <span className="whitespace-pre-wrap">{r.notes}</span> : "—"}</Row>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Customer</h2>
            <dl className="mt-2 divide-y divide-slate-100">
              <Row label="Name">{r.name} {r.surname}</Row>
              <Row label="Age">{r.age}</Row>
              <Row label="Phone">
                <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">{r.phone}</a>
                {" · "}
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="text-[#128C7E] hover:underline">WhatsApp</a>
                {" · "}
                <a href={`viber://chat?number=%2B${phoneDigits}`} className="text-[#7360F2] hover:underline">Viber</a>
              </Row>
              <Row label="Email">
                {r.email ? <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a> : "—"}
              </Row>
              <Row label="Terms accepted">{r.agreedToTerms ? "Yes" : "No"}</Row>
              <Row label="Submitted">{formatDateTime(r.createdAt)}</Row>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Follow-up</h2>
            <div className="mt-3">
              <AdminNotes
                id={r.id}
                notes={r.adminNotes}
                contactedAt={r.contactedAt ? r.contactedAt.toISOString() : null}
              />
            </div>
          </section>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Previous bookings
            {history.length > 0 && (
              <span className="ml-2 rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-slate-900">
                Returning customer
              </span>
            )}
          </h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">First booking from this phone number.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100 text-sm">
              {history.map((h) => (
                <li key={h.id} className="py-2">
                  <Link href={`/admin/reservations/${h.id}`} className="font-medium text-slate-900 hover:underline">
                    {h.type === "taxi" ? "Taxi" : h.carName}
                  </Link>
                  <div className="text-slate-500">
                    {formatDate(h.pickupDate)} · {STATUS_LABELS[h.status as ReservationStatus] ?? h.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

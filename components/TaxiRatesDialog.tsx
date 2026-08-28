"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  taxiTiers,
  taxiRoutes,
  tierForPassengers,
  formatPrice,
  MIN_PASSENGERS,
  MAX_PASSENGERS,
} from "@/app/lib/taxi-data";
import { siteConfig } from "@/app/lib/site-config";

/**
 * Fired when the visitor picks "Book this transfer". BookingForm listens and
 * pre-fills itself, so the URL never changes and no page is loaded.
 */
export const BOOKING_PREFILL_EVENT = "angelova:booking-prefill";
export type BookingPrefill = {
  type: "taxi";
  dropoffLocation: string;
  passengers: number;
};

export default function TaxiRatesDialog({
  buttonClassName,
  buttonLabel = "See all prices & locations",
}: {
  buttonClassName: string;
  buttonLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [passengers, setPassengers] = useState(2);
  const [selected, setSelected] = useState<string | null>(null);

  const tier = tierForPassengers(passengers);

  function open() {
    dialogRef.current?.showModal();
  }
  function close() {
    dialogRef.current?.close();
  }

  // Lock page scroll while open; return focus to the trigger on close.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    function onClose() {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  function onBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close();
  }

  function bookTransfer(destination: string) {
    close();
    const detail: BookingPrefill = { type: "taxi", dropoffLocation: destination, passengers };
    window.dispatchEvent(new CustomEvent(BOOKING_PREFILL_EVENT, { detail }));
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const whatsapp = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi, I'd like a quote for a transfer for ${passengers} people.`
  )}`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          document.body.style.overflow = "hidden";
          open();
        }}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-[fade-in_.2s_ease-out] motion-reduce:open:animate-none"
      >
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-black px-5 py-4 text-white sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                Taxi &amp; minibus transfers
              </p>
              <h2 id={titleId} className="mt-1 text-lg font-semibold sm:text-xl">
                Fixed prices from Pafos
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close price list"
              className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Passenger picker */}
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">How many are travelling?</p>
                <p className="text-xs text-slate-500">
                  {tier ? `${tier.vehicle} · ${tier.label} people` : "—"}
                </p>
              </div>
              <div className="flex items-center gap-2" role="group" aria-label="Passengers">
                <button
                  type="button"
                  aria-label="Fewer passengers"
                  disabled={passengers <= MIN_PASSENGERS}
                  onClick={() => setPassengers((p) => Math.max(MIN_PASSENGERS, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold transition-colors hover:border-brand disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  −
                </button>
                <output className="w-10 text-center text-xl font-bold tabular-nums" aria-live="polite">
                  {passengers}
                </output>
                <button
                  type="button"
                  aria-label="More passengers"
                  disabled={passengers >= MAX_PASSENGERS}
                  onClick={() => setPassengers((p) => Math.min(MAX_PASSENGERS, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold transition-colors hover:border-brand disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Mobile: one price per destination for the selected group size */}
          <ul className="divide-y divide-slate-200 sm:hidden">
            {taxiRoutes.map((route) => {
              const price = tier ? route.prices[tier.key] : null;
              const isOpen = selected === route.id;
              return (
                <li key={route.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelected(isOpen ? null : route.id)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className="truncate font-medium">{route.destination}</span>
                      <span className="shrink-0 text-lg font-bold text-brand-dark">
                        {formatPrice(price ?? null)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => bookTransfer(route.destination)}
                      className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      Book
                    </button>
                  </div>
                  {isOpen && (
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      {taxiTiers.map((t) => (
                        <div
                          key={t.key}
                          className={`rounded-lg border px-2 py-1.5 ${
                            t.key === tier?.key
                              ? "border-brand bg-brand/10"
                              : "border-slate-200"
                          }`}
                        >
                          <dt className="text-slate-500">{t.label} ppl</dt>
                          <dd className="font-semibold">{formatPrice(route.prices[t.key] ?? null)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Tablet & up: full table, selected group size highlighted */}
          <div className="hidden px-5 py-4 sm:block sm:px-6">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Destination
                  </th>
                  {taxiTiers.map((t) => (
                    <th
                      key={t.key}
                      scope="col"
                      className={`rounded-t-lg px-2 py-2 text-center font-medium transition-colors ${
                        t.key === tier?.key ? "bg-brand/15 text-slate-900" : ""
                      }`}
                    >
                      {t.label}
                      <span className="block text-[10px] font-normal normal-case text-slate-400">
                        {t.vehicle}
                      </span>
                    </th>
                  ))}
                  <th scope="col" className="sr-only">
                    Book
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {taxiRoutes.map((route) => (
                  <tr key={route.id} className="group">
                    <th scope="row" className="py-2.5 pr-3 font-medium text-slate-900">
                      {route.destination}
                    </th>
                    {taxiTiers.map((t) => (
                      <td
                        key={t.key}
                        className={`px-2 py-2.5 text-center tabular-nums transition-colors ${
                          t.key === tier?.key
                            ? "bg-brand/15 font-bold text-slate-900"
                            : "text-slate-600"
                        }`}
                      >
                        {formatPrice(route.prices[t.key] ?? null)}
                      </td>
                    ))}
                    <td className="py-2.5 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => bookTransfer(route.destination)}
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 opacity-70 transition-all hover:border-brand hover:bg-brand hover:text-black group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Prices per vehicle, one-way, from Pafos. Other destinations or more than{" "}
              {MAX_PASSENGERS} people — ask us.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-[#25D366] hover:text-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}

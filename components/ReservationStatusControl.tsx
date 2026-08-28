"use client";

import { useState, useTransition } from "react";
import { updateReservationStatus } from "@/app/actions/reservations";
import { RESERVATION_STATUSES, STATUS_LABELS } from "@/app/lib/reservation-status";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-amber-100 text-amber-800",
};

export default function ReservationStatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const previous = current;
    setCurrent(next);
    setError(null);
    startTransition(async () => {
      const result = await updateReservationStatus(id, next);
      if (!result.ok) {
        setCurrent(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <select
        value={current}
        disabled={isPending}
        onChange={handleChange}
        aria-label="Reservation status"
        className={`rounded-full border-0 px-2 py-1 text-xs font-medium outline-none transition-opacity focus:ring-2 focus:ring-brand ${
          STATUS_STYLES[current] ?? "bg-slate-100 text-slate-700"
        } ${isPending ? "opacity-60" : ""}`}
      >
        {RESERVATION_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { updateReservationStatus } from "@/app/actions/reservations";

const STATUS_OPTIONS = [
  { value: "new", label: "Pending" },
  { value: "confirmed", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ReservationStatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setCurrent(next);
    startTransition(async () => {
      await updateReservationStatus(id, next);
    });
  }

  return (
    <select
      value={current}
      disabled={isPending}
      onChange={handleChange}
      className={`rounded-full border-0 px-2 py-1 text-xs font-medium capitalize outline-none transition-opacity focus:ring-2 focus:ring-brand ${
        STATUS_STYLES[current] ?? "bg-slate-100 text-slate-700"
      } ${isPending ? "opacity-60" : ""}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

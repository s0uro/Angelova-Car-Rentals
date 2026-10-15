"use client";

import { useState, useTransition } from "react";
import { updateCarQuantity } from "@/app/actions/admin";
import { MAX_UNITS } from "@/app/lib/availability-core";

export default function CarQuantityControl({
  carName,
  quantity,
}: {
  carName: string;
  quantity: number;
}) {
  const [value, setValue] = useState(String(quantity));
  const [saved, setSaved] = useState(quantity);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const parsed = Number(value);
  const valid = value.trim() !== "" && Number.isInteger(parsed) && parsed >= 0 && parsed <= MAX_UNITS;

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid) {
      setMessage(`Enter a whole number from 0 to ${MAX_UNITS}.`);
      return;
    }
    if (parsed === saved) return;
    startTransition(async () => {
      const result = await updateCarQuantity(carName, parsed);
      if (result.ok) {
        setSaved(parsed);
        setMessage("Saved");
        setTimeout(() => setMessage(null), 1500);
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        min={0}
        max={MAX_UNITS}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setMessage(null);
        }}
        aria-label={`Units of ${carName} in the fleet`}
        aria-invalid={!valid}
        className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
      <button
        type="submit"
        disabled={pending || !valid || parsed === saved}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <span aria-live="polite" className={`text-xs ${message === "Saved" ? "text-emerald-700" : "text-red-600"}`}>
        {message}
      </span>
    </form>
  );
}

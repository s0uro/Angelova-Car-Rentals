"use client";

import { useActionState } from "react";
import { createReservation, type BookingState } from "@/app/actions/bookings";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export default function BookingForm() {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    createReservation,
    undefined
  );

  if (state?.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-semibold">Reservation request received!</p>
        <p className="mt-1 text-sm">
          We&apos;ll be in touch shortly to confirm the details.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset>
        <legend className={labelClass}>Service type</legend>
        <div className="flex gap-6 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="type" value="car" defaultChecked />
            Car rental
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="type" value="taxi" />
            Taxi
          </label>
        </div>
        {state?.errors?.type && (
          <p className="mt-1 text-sm text-red-600">{state.errors.type}</p>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input id="name" name="name" className={inputClass} />
          {state?.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} />
          {state?.errors?.phone && (
            <p className="mt-1 text-sm text-red-600">{state.errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email (optional)
        </label>
        <input id="email" name="email" type="email" className={inputClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="pickupDate" className={labelClass}>
            Pickup date &amp; time
          </label>
          <input
            id="pickupDate"
            name="pickupDate"
            type="datetime-local"
            className={inputClass}
          />
          {state?.errors?.pickupDate && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.pickupDate}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="dropoffDate" className={labelClass}>
            Drop-off date &amp; time (car rentals)
          </label>
          <input
            id="dropoffDate"
            name="dropoffDate"
            type="datetime-local"
            className={inputClass}
          />
          {state?.errors?.dropoffDate && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.dropoffDate}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="pickupLocation" className={labelClass}>
            Pickup location
          </label>
          <input
            id="pickupLocation"
            name="pickupLocation"
            className={inputClass}
          />
          {state?.errors?.pickupLocation && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.pickupLocation}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="dropoffLocation" className={labelClass}>
            Drop-off location (optional)
          </label>
          <input
            id="dropoffLocation"
            name="dropoffLocation"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit reservation request"}
      </button>
    </form>
  );
}

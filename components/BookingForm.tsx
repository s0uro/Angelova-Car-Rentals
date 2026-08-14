"use client";

import { useActionState } from "react";
import { createReservation, type BookingState } from "@/app/actions/bookings";
import styles from "@/components/BookingForm.module.css";

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
    <form action={formAction} className={styles.form}>
      <p className={styles.title}>Book your ride</p>
      <p className={styles.message}>
        Tell us what you need and we&apos;ll confirm your reservation shortly.
      </p>

      <div className={styles.typeGroup}>
        <label className={styles.typeOption}>
          <input type="radio" name="type" value="car" defaultChecked />
          Car rental
        </label>
        <label className={styles.typeOption}>
          <input type="radio" name="type" value="taxi" />
          Taxi
        </label>
      </div>
      {state?.errors?.type && <p className={styles.error}>{state.errors.type}</p>}

      <div className={styles.flex}>
        <label>
          <input
            id="name"
            name="name"
            required
            placeholder=" "
            type="text"
            className={styles.input}
          />
          <span>Full name</span>
        </label>

        <label>
          <input
            id="phone"
            name="phone"
            required
            placeholder=" "
            type="tel"
            className={styles.input}
          />
          <span>Phone number</span>
        </label>
      </div>
      {(state?.errors?.name || state?.errors?.phone) && (
        <p className={styles.error}>
          {[state?.errors?.name, state?.errors?.phone].filter(Boolean).join(" ")}
        </p>
      )}

      <label>
        <input id="email" name="email" placeholder=" " type="email" className={styles.input} />
        <span>Email (optional)</span>
      </label>

      <div className={styles.flex}>
        <label>
          <input
            id="pickupDate"
            name="pickupDate"
            required
            placeholder=" "
            type="datetime-local"
            className={styles.input}
          />
          <span>Pickup date &amp; time</span>
        </label>

        <label>
          <input
            id="dropoffDate"
            name="dropoffDate"
            placeholder=" "
            type="datetime-local"
            className={styles.input}
          />
          <span>Drop-off (car rentals)</span>
        </label>
      </div>
      {(state?.errors?.pickupDate || state?.errors?.dropoffDate) && (
        <p className={styles.error}>
          {[state?.errors?.pickupDate, state?.errors?.dropoffDate].filter(Boolean).join(" ")}
        </p>
      )}

      <div className={styles.flex}>
        <label>
          <input
            id="pickupLocation"
            name="pickupLocation"
            required
            placeholder=" "
            type="text"
            className={styles.input}
          />
          <span>Pickup location</span>
        </label>

        <label>
          <input
            id="dropoffLocation"
            name="dropoffLocation"
            placeholder=" "
            type="text"
            className={styles.input}
          />
          <span>Drop-off location</span>
        </label>
      </div>
      {state?.errors?.pickupLocation && <p className={styles.error}>{state.errors.pickupLocation}</p>}

      <label>
        <textarea id="notes" name="notes" rows={3} placeholder=" " className={styles.input} />
        <span>Notes (optional)</span>
      </label>

      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? "Submitting…" : "Submit reservation request"}
      </button>
    </form>
  );
}

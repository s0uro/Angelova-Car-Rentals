"use client";

import { useActionState, useState } from "react";
import { createReservation, type BookingState } from "@/app/actions/bookings";
import { fleet, formatRate } from "@/app/lib/fleet-data";
import styles from "@/components/BookingForm.module.css";

const MIN_AGE = 25;

type Values = {
  type: "car" | "taxi";
  carName: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  notes: string;
  name: string;
  surname: string;
  age: string;
  phone: string;
  email: string;
  agreedToTerms: boolean;
};

const initialValues: Values = {
  type: "car",
  carName: "",
  pickupDate: "",
  dropoffDate: "",
  pickupLocation: "",
  dropoffLocation: "",
  notes: "",
  name: "",
  surname: "",
  age: "",
  phone: "",
  email: "",
  agreedToTerms: false,
};

function validateStep1(v: Values) {
  const errors: Record<string, string> = {};
  if (v.type === "car" && !v.carName) errors.carName = "Please select a car.";
  if (!v.pickupDate) errors.pickupDate = "A pickup date & time is required.";
  if (!v.pickupLocation) errors.pickupLocation = "Pickup location is required.";
  return errors;
}

function validateStep2(v: Values) {
  const errors: Record<string, string> = {};
  if (!v.name) errors.name = "First name is required.";
  if (!v.surname) errors.surname = "Surname is required.";
  const age = Number(v.age);
  if (!v.age || Number.isNaN(age) || !Number.isInteger(age)) {
    errors.age = "Age is required.";
  } else if (age < MIN_AGE) {
    errors.age = `You must be at least ${MIN_AGE} years old to book.`;
  }
  if (!v.phone) errors.phone = "Phone number is required.";
  return errors;
}

export default function BookingForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    createReservation,
    undefined
  );
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(initialValues);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function goNext(validate: (v: Values) => Record<string, string>) {
    const errors = validate(values);
    setStepErrors(errors);
    if (Object.keys(errors).length === 0) {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    setStepErrors({});
    setStep((s) => s - 1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!values.agreedToTerms) {
      e.preventDefault();
      setStepErrors({ agreedToTerms: "You must agree to the terms to continue." });
    }
  }

  if (state?.success) {
    return (
      <div className={`${styles.form} ${styles.success}`}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={styles.successTitle}>Thanks for booking!</p>
        <p className={styles.message}>
          We&apos;ll be in touch shortly to confirm the details.
        </p>
      </div>
    );
  }

  const errors = { ...stepErrors, ...state?.errors };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className={`${styles.form} ${compact ? styles.compact : ""}`}
    >
      <p className={styles.title}>Book your ride</p>
      <p className={styles.message}>Step {step} of 3</p>

      {/* Hidden inputs keep values from other steps in the submitted FormData */}
      <input type="hidden" name="type" value={values.type} />
      <input type="hidden" name="carName" value={values.carName} />
      <input type="hidden" name="pickupDate" value={values.pickupDate} />
      <input type="hidden" name="dropoffDate" value={values.dropoffDate} />
      <input type="hidden" name="pickupLocation" value={values.pickupLocation} />
      <input type="hidden" name="dropoffLocation" value={values.dropoffLocation} />
      <input type="hidden" name="notes" value={values.notes} />
      <input type="hidden" name="name" value={values.name} />
      <input type="hidden" name="surname" value={values.surname} />
      <input type="hidden" name="age" value={values.age} />
      <input type="hidden" name="phone" value={values.phone} />
      <input type="hidden" name="email" value={values.email} />
      {values.agreedToTerms && (
        <input type="hidden" name="agreedToTerms" value="on" />
      )}

      {step === 1 && (
        <>
          <div className={styles.typeGroup}>
            <label className={styles.typeOption}>
              <input
                type="radio"
                checked={values.type === "car"}
                onChange={() => set("type", "car")}
              />
              Car rental
            </label>
            <label className={styles.typeOption}>
              <input
                type="radio"
                checked={values.type === "taxi"}
                onChange={() => set("type", "taxi")}
              />
              Taxi
            </label>
          </div>

          {values.type === "car" && (
            <label>
              <span className={styles.fieldLabel}>Select a car</span>
              <select
                className={styles.select}
                value={values.carName}
                onChange={(e) => set("carName", e.target.value)}
              >
                <option value="">Choose a vehicle…</option>
                {fleet.map((car) => (
                  <option key={car.id} value={car.name}>
                    {car.name} — from {formatRate(car.rates.oneDay)}/day
                  </option>
                ))}
              </select>
            </label>
          )}
          {errors.carName && <p className={styles.error}>{errors.carName}</p>}

          <div className={styles.flex}>
            <label>
              <input
                placeholder=" "
                type="datetime-local"
                className={styles.input}
                value={values.pickupDate}
                onChange={(e) => set("pickupDate", e.target.value)}
              />
              <span>Pickup date &amp; time</span>
            </label>

            <label>
              <input
                placeholder=" "
                type="datetime-local"
                className={styles.input}
                value={values.dropoffDate}
                onChange={(e) => set("dropoffDate", e.target.value)}
              />
              <span>Drop-off (car rentals)</span>
            </label>
          </div>
          {(errors.pickupDate || errors.dropoffDate) && (
            <p className={styles.error}>
              {[errors.pickupDate, errors.dropoffDate].filter(Boolean).join(" ")}
            </p>
          )}

          <div className={styles.flex}>
            <label>
              <input
                placeholder=" "
                type="text"
                className={styles.input}
                value={values.pickupLocation}
                onChange={(e) => set("pickupLocation", e.target.value)}
              />
              <span>Pickup location</span>
            </label>

            <label>
              <input
                placeholder=" "
                type="text"
                className={styles.input}
                value={values.dropoffLocation}
                onChange={(e) => set("dropoffLocation", e.target.value)}
              />
              <span>Drop-off location</span>
            </label>
          </div>
          {errors.pickupLocation && <p className={styles.error}>{errors.pickupLocation}</p>}

          <button
            type="button"
            onClick={() => goNext(validateStep1)}
            className={styles.submit}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className={styles.flex}>
            <label>
              <input
                placeholder=" "
                type="text"
                className={styles.input}
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <span>First name</span>
            </label>

            <label>
              <input
                placeholder=" "
                type="text"
                className={styles.input}
                value={values.surname}
                onChange={(e) => set("surname", e.target.value)}
              />
              <span>Surname</span>
            </label>
          </div>
          {(errors.name || errors.surname) && (
            <p className={styles.error}>
              {[errors.name, errors.surname].filter(Boolean).join(" ")}
            </p>
          )}

          <div className={styles.flex}>
            <label>
              <input
                placeholder=" "
                type="number"
                min={MIN_AGE}
                className={styles.input}
                value={values.age}
                onChange={(e) => set("age", e.target.value)}
              />
              <span>Age (min {MIN_AGE})</span>
            </label>

            <label>
              <input
                placeholder=" "
                type="tel"
                className={styles.input}
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              <span>Phone number</span>
            </label>
          </div>
          {errors.age && <p className={styles.error}>{errors.age}</p>}
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}

          <label>
            <input
              placeholder=" "
              type="email"
              className={styles.input}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <span>Email (optional)</span>
          </label>

          <div className={styles.actions}>
            <button type="button" onClick={goBack} className={styles.secondary}>
              Back
            </button>
            <button
              type="button"
              onClick={() => goNext(validateStep2)}
              className={styles.submit}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <label>
            <textarea
              rows={3}
              placeholder=" "
              className={styles.input}
              value={values.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
            <span>Notes (optional)</span>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={values.agreedToTerms}
              onChange={(e) => {
                set("agreedToTerms", e.target.checked);
                setStepErrors({});
              }}
            />
            <span>
              I agree to the terms &amp; conditions and confirm the details
              above are correct.
            </span>
          </label>
          {errors.agreedToTerms && <p className={styles.error}>{errors.agreedToTerms}</p>}
          {errors.type && <p className={styles.error}>{errors.type}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={goBack} className={styles.secondary}>
              Back
            </button>
            <button type="submit" disabled={pending} className={styles.submit}>
              {pending ? "Submitting…" : "Finish & submit"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

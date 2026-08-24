"use client";

import { useActionState, useState } from "react";
import { createReservation, type BookingState } from "@/app/actions/bookings";
import { fleet, formatRate } from "@/app/lib/fleet-data";
import { pafosAreas } from "@/app/lib/site-config";
import { countries, countryFlag } from "@/app/lib/countries";
import styles from "@/components/BookingForm.module.css";

const DEFAULT_PHONE_COUNTRY = "+357"; // Cyprus

const MIN_AGE = 25;

export type BookedRange = {
  carName: string;
  pickupDate: string;
  dropoffDate: string;
};

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
  phoneCountry: string;
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
  phoneCountry: DEFAULT_PHONE_COUNTRY,
  phone: "",
  email: "",
  agreedToTerms: false,
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function findConflict(v: Values, bookedRanges: BookedRange[]) {
  if (v.type !== "car" || !v.carName || !v.pickupDate) return undefined;
  const start = new Date(v.pickupDate).getTime();
  const end = v.dropoffDate ? new Date(v.dropoffDate).getTime() : start + MS_PER_DAY;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return undefined;

  return bookedRanges.find((b) => {
    if (b.carName !== v.carName) return false;
    const bStart = new Date(b.pickupDate).getTime();
    const bEnd = new Date(b.dropoffDate).getTime();
    return start < bEnd && bStart < end;
  });
}

function validateStep1(v: Values, bookedRanges: BookedRange[]) {
  const errors: Record<string, string> = {};
  if (v.type === "car" && !v.carName) errors.carName = "Please select a car.";
  if (!v.pickupDate) errors.pickupDate = "A pickup date & time is required.";
  if (!v.pickupLocation) errors.pickupLocation = "Pickup location is required.";
  if (!errors.carName && !errors.pickupDate && findConflict(v, bookedRanges)) {
    errors.carName =
      "This car is already booked for the selected dates. Please choose different dates or another car.";
  }
  return errors;
}

function calculateRentalTotal(v: Values) {
  if (v.type !== "car" || !v.carName || !v.pickupDate || !v.dropoffDate) {
    return null;
  }
  const car = fleet.find((c) => c.name === v.carName);
  if (!car) return null;

  const pickup = new Date(v.pickupDate).getTime();
  const dropoff = new Date(v.dropoffDate).getTime();
  const diffMs = dropoff - pickup;
  if (!Number.isFinite(diffMs) || diffMs <= 0) return null;

  const days = Math.max(1, Math.ceil(diffMs / MS_PER_DAY));
  const perDay =
    days === 1
      ? car.rates.oneDay
      : days <= 3
      ? car.rates.twoToThreeDays
      : days <= 7
      ? car.rates.fourToSevenDays
      : days <= 14
      ? car.rates.eightToFourteenDays
      : car.rates.fourteenPlusDays;

  return {
    car,
    days,
    total: perDay === null ? null : perDay * days,
  };
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

export default function BookingForm({
  compact = false,
  bookedRanges = [],
  bookedUntilByCarId = {},
}: {
  compact?: boolean;
  bookedRanges?: BookedRange[];
  bookedUntilByCarId?: Record<string, string>;
}) {
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
  const rentalTotal = calculateRentalTotal(values);
  const conflict = findConflict(values, bookedRanges);

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
      <input
        type="hidden"
        name="phone"
        value={values.phone ? `${values.phoneCountry} ${values.phone}` : ""}
      />
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
                    {bookedUntilByCarId[car.id]
                      ? ` (booked until ${new Date(bookedUntilByCarId[car.id]).toLocaleDateString()})`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          {errors.carName && <p className={styles.error}>{errors.carName}</p>}
          {!errors.carName && conflict && (
            <p className={styles.error}>
              {conflict.carName} is booked from{" "}
              {new Date(conflict.pickupDate).toLocaleDateString()} to{" "}
              {new Date(conflict.dropoffDate).toLocaleDateString()}. Please
              choose different dates or another car.
            </p>
          )}

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
              <span className={styles.fieldLabel}>Pickup location</span>
              <select
                className={styles.select}
                value={values.pickupLocation}
                onChange={(e) => set("pickupLocation", e.target.value)}
              >
                <option value="">Choose an area…</option>
                {pafosAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className={styles.fieldLabel}>Drop-off location</span>
              <select
                className={styles.select}
                value={values.dropoffLocation}
                onChange={(e) => set("dropoffLocation", e.target.value)}
              >
                <option value="">Choose an area…</option>
                {pafosAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {errors.pickupLocation && <p className={styles.error}>{errors.pickupLocation}</p>}

          <button
            type="button"
            onClick={() => goNext((v) => validateStep1(v, bookedRanges))}
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
              <span className={styles.fieldLabel}>Country</span>
              <select
                className={styles.select}
                value={values.phoneCountry}
                onChange={(e) => set("phoneCountry", e.target.value)}
              >
                {countries.map((country) => (
                  <option key={country.iso2} value={country.dialCode}>
                    {countryFlag(country.iso2)} {country.name} (
                    {country.dialCode})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <input
              placeholder=" "
              type="tel"
              className={styles.input}
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            <span>Phone number ({values.phoneCountry})</span>
          </label>
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
          {rentalTotal && (
            <div className={styles.priceSummary}>
              <p className={styles.priceSummaryLabel}>
                {rentalTotal.car.name} · {rentalTotal.days}{" "}
                {rentalTotal.days === 1 ? "day" : "days"}
              </p>
              <p className={styles.priceSummaryTotal}>
                {rentalTotal.total === null
                  ? "Contact us for a quote"
                  : `Total: ${formatRate(rentalTotal.total)}`}
              </p>
            </div>
          )}

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

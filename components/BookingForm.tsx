"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createReservation, type BookingState } from "@/app/actions/bookings";
import { fleet, formatRate } from "@/app/lib/fleet-data";
import { quoteRental } from "@/app/lib/pricing";
import { pafosAreas, siteConfig } from "@/app/lib/site-config";
import { countries, countryFlag } from "@/app/lib/countries";
import {
  reservationSchema,
  issuesToErrors,
  STEP_FIELDS,
  MIN_AGE,
  MAX_AGE,
} from "@/app/lib/booking-schema";
import {
  localInputToDate,
  nowLocalInput,
  formatDateTime,
} from "@/app/lib/timezone";
import {
  taxiDestinations,
  OTHER_DESTINATION,
  getTransferPrice,
  tierForPassengers,
  formatPrice,
  MIN_PASSENGERS,
  MAX_PASSENGERS,
} from "@/app/lib/taxi-data";
import { BOOKING_PREFILL_EVENT, type BookingPrefill } from "@/components/TaxiRatesDialog";
import styles from "@/components/BookingForm.module.css";

const DEFAULT_PHONE_COUNTRY = "+357"; // Cyprus

type Values = {
  type: "car" | "taxi";
  carName: string;
  pickupDate: string; // datetime-local string, Cyprus wall-clock
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  passengers: string;
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
  passengers: "2",
  notes: "",
  name: "",
  surname: "",
  age: "",
  phoneCountry: DEFAULT_PHONE_COUNTRY,
  phone: "",
  email: "",
  agreedToTerms: false,
};

/** What actually gets submitted / validated (dates as ISO instants). */
function toSubmission(v: Values) {
  return {
    type: v.type,
    carName: v.type === "car" ? v.carName : "",
    pickupDate: localInputToDate(v.pickupDate)?.toISOString() ?? "",
    dropoffDate:
      v.type === "car" ? (localInputToDate(v.dropoffDate)?.toISOString() ?? "") : "",
    pickupLocation: v.pickupLocation,
    dropoffLocation: v.dropoffLocation,
    passengers: v.type === "taxi" ? v.passengers : "",
    notes: v.notes,
    name: v.name,
    surname: v.surname,
    age: v.age,
    phone: v.phone ? `${v.phoneCountry}${v.phone}` : "",
    email: v.email,
    agreedToTerms: v.agreedToTerms,
  };
}

function validateStep(step: 1 | 2 | 3, v: Values) {
  const result = reservationSchema.safeParse(toSubmission(v));
  const errors: Record<string, string> = {};
  if (!result.success) {
    const all = issuesToErrors(result.error.issues);
    const keys = new Set<string>(STEP_FIELDS[step]);
    for (const [key, message] of Object.entries(all)) {
      if (keys.has(key)) errors[key] = message;
    }
  }
  return errors;
}

type ReviewRow = { label: string; value: string; step: 1 | 2 | 3 };

/** The confirm-step summary, reused on the success screen. */
function buildReviewRows(v: Values): ReviewRow[] {
  const isTaxi = v.type === "taxi";
  const tier = isTaxi ? tierForPassengers(Number(v.passengers)) : null;
  return [
    {
      label: isTaxi ? "Transfer" : "Car",
      value: isTaxi ? `${tier?.vehicle ?? "Taxi"} · ${v.passengers} people` : v.carName || "—",
      step: 1,
    },
    {
      label: "Pickup",
      value: `${formatDateTime(localInputToDate(v.pickupDate))} · ${v.pickupLocation || "—"}`,
      step: 1,
    },
    {
      label: isTaxi ? "Destination" : "Drop-off",
      value: isTaxi
        ? v.dropoffLocation || "—"
        : `${formatDateTime(localInputToDate(v.dropoffDate))}${
            v.dropoffLocation ? ` · ${v.dropoffLocation}` : ""
          }`,
      step: 1,
    },
    { label: "Name", value: `${v.name} ${v.surname}`.trim() || "—", step: 2 },
    { label: "Phone", value: `${v.phoneCountry}${v.phone}`, step: 2 },
    ...(v.email ? [{ label: "Email", value: v.email, step: 2 as const }] : []),
  ];
}

export default function BookingForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    createReservation,
    undefined
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<Values>(initialValues);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ label: string; value: string }[] | null>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Pre-fill from the taxi price dialog ("Book this transfer") or from a deep
  // link like /#booking?type=taxi&to=Nicosia&pax=5 — no navigation involved.
  useEffect(() => {
    function applyTaxi(p: Partial<Extract<BookingPrefill, { type: "taxi" }>>) {
      // Called from an event handler or a timeout, never during render.
      setValues((v) => ({
        ...v,
        type: "taxi",
        carName: "",
        dropoffDate: "",
        dropoffLocation: p.dropoffLocation ?? v.dropoffLocation,
        passengers: p.passengers ? String(p.passengers) : v.passengers,
      }));
      setStep(1);
      setStepErrors({});
    }
    function applyCar(carName: string) {
      setValues((v) => ({ ...v, type: "car", carName }));
      setStep(1);
      setStepErrors({});
    }
    function onPrefill(e: Event) {
      const detail = (e as CustomEvent<BookingPrefill>).detail;
      if (detail.type === "car") {
        applyCar(detail.carName);
      } else {
        applyTaxi(detail);
      }
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.addEventListener(BOOKING_PREFILL_EVENT, onPrefill);

    const hash = window.location.hash;
    const q = hash.includes("?") ? new URLSearchParams(hash.slice(hash.indexOf("?"))) : null;
    const carParam = q?.get("car");
    const wantsTaxi = q?.get("type") === "taxi";
    const pax = Number(q?.get("pax"));
    const timer = window.setTimeout(() => {
      const carMatches = carParam && fleet.some((c) => c.name === carParam);
      if (carMatches) applyCar(carParam);
      if (wantsTaxi) {
        applyTaxi({
          dropoffLocation: q?.get("to") ?? undefined,
          passengers: Number.isFinite(pax) && pax > 0 ? pax : undefined,
        });
      }
      // The href is /#booking?car=X (or ?type=taxi&...): the "?" sits inside
      // the hash, so the browser never auto-scrolls to id="booking" on its own.
      if (carMatches || wantsTaxi) {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(BOOKING_PREFILL_EVENT, onPrefill);
    };
  }, []);
  const [minPickup, setMinPickup] = useState("");

  // Client-only values written after mount (they would differ between server
  // and client render otherwise).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    const id = window.setTimeout(() => setMinPickup(nowLocalInput()), 0);
    return () => window.clearTimeout(id);
  }, []);

  // If the server rejects a field from an earlier step, take the user back to
  // it. (State adjusted during render, per React docs, instead of an effect.)
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    const keys = Object.keys(state?.errors ?? {});
    const target = ([1, 2, 3] as const).find((s) =>
      keys.some((k) => (STEP_FIELDS[s] as string[]).includes(k))
    );
    if (target) setStep(target);
  }

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear the error for the field being edited.
    setStepErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function goNext() {
    const errors = validateStep(step, values);
    setStepErrors(errors);
    if (Object.keys(errors).length === 0 && step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3);
    }
  }

  function goBack() {
    setStepErrors({});
    setStep((s) => (s - 1) as 1 | 2 | 3);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const errors = validateStep(3, values);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setStepErrors(errors);
      return;
    }
    // Snapshot for the confirmation screen — `values` may be reset afterwards.
    setSubmitted(buildReviewRows(values).map(({ label, value }) => ({ label, value })));
  }

  if (state?.success) {
    const waHref = state.reference
      ? `${siteConfig.whatsapp}?text=${encodeURIComponent(
          `Hi, I just booked with reference ${state.reference}.`
        )}`
      : siteConfig.whatsapp;

    return (
      <div className={`${styles.form} ${styles.success}`}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={styles.successTitle}>Thanks for booking!</p>
        <p className={styles.message}>
          We&apos;ll call or message you to confirm, usually within a couple of hours
          (we answer {siteConfig.hours.toLowerCase()}).
        </p>

        {state.reference && (
          <p className={styles.reference}>
            Your reference: <strong>{state.reference}</strong>
          </p>
        )}

        {submitted && submitted.length > 0 && (
          <div className={styles.review}>
            {submitted.map((row) => (
              <div key={row.label} className={styles.reviewRow}>
                <span className={styles.reviewLabel}>{row.label}</span>
                <span className={styles.reviewValue}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.submit}
            style={{ display: "block", textAlign: "center", textDecoration: "none" }}
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const errors = { ...state?.errors, ...stepErrors };
  const submission = toSubmission(values);
  const rentalTotal =
    values.type === "car"
      ? quoteRental(values.carName, localInputToDate(values.pickupDate), localInputToDate(values.dropoffDate))
      : null;
  const isTaxi = values.type === "taxi";
  const passengersNum = Number(values.passengers);
  const taxiTier = isTaxi ? tierForPassengers(passengersNum) : null;
  const taxiPrice =
    isTaxi && values.dropoffLocation ? getTransferPrice(values.dropoffLocation, passengersNum) : null;
  const taxiIsOther = isTaxi && values.dropoffLocation === OTHER_DESTINATION;

  const reviewRows = buildReviewRows(values);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className={`${styles.form} ${compact ? styles.compact : ""}`}
    >
      <p className={styles.title}>Book your ride</p>
      <div className={styles.steps} aria-label={`Step ${step} of 3`}>
        {(["Trip", "Details", "Confirm"] as const).map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          return (
            <button
              key={label}
              type="button"
              className={styles.stepSegment}
              data-state={n === step ? "current" : n < step ? "done" : "todo"}
              data-clickable={n < step}
              onClick={() => n < step && setStep(n)}
              aria-current={n === step ? "step" : undefined}
              disabled={n > step}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Anti-spam: honeypot + time-to-fill (see app/actions/bookings.ts) */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAtRef} type="hidden" name="formStartedAt" defaultValue="0" />

      {/* Hidden inputs carry values from every step; dates are sent as ISO instants (Cyprus time). */}
      <input type="hidden" name="type" value={submission.type} />
      <input type="hidden" name="carName" value={submission.carName} />
      <input type="hidden" name="pickupDate" value={submission.pickupDate} />
      <input type="hidden" name="dropoffDate" value={submission.dropoffDate} />
      <input type="hidden" name="pickupLocation" value={submission.pickupLocation} />
      <input type="hidden" name="dropoffLocation" value={submission.dropoffLocation} />
      <input type="hidden" name="passengers" value={submission.passengers} />
      <input type="hidden" name="notes" value={submission.notes} />
      <input type="hidden" name="name" value={submission.name} />
      <input type="hidden" name="surname" value={submission.surname} />
      <input type="hidden" name="age" value={submission.age} />
      <input type="hidden" name="phone" value={submission.phone} />
      <input type="hidden" name="email" value={submission.email} />
      {values.agreedToTerms && <input type="hidden" name="agreedToTerms" value="on" />}

      {errors.form && (
        <p role="alert" className={styles.formError}>
          {errors.form}
        </p>
      )}

      {step === 1 && (
        <>
          <div className={styles.typeGroup} role="radiogroup" aria-label="Service type">
            <label className={styles.typeOption}>
              <input
                type="radio"
                name="serviceType"
                checked={values.type === "car"}
                onChange={() => set("type", "car")}
              />
              Car rental
            </label>
            <label className={styles.typeOption}>
              <input
                type="radio"
                name="serviceType"
                checked={values.type === "taxi"}
                onChange={() => set("type", "taxi")}
              />
              Taxi
            </label>
          </div>

          {isTaxi && (
            <label>
              <span className={styles.fieldLabel}>
                Passengers{taxiTier ? ` · ${taxiTier.vehicle}` : ""}
              </span>
              <input
                type="number"
                min={MIN_PASSENGERS}
                max={MAX_PASSENGERS}
                inputMode="numeric"
                className={styles.input}
                value={values.passengers}
                onChange={(e) => set("passengers", e.target.value)}
                aria-invalid={Boolean(errors.passengers)}
              />
            </label>
          )}
          {errors.passengers && <p className={styles.error}>{errors.passengers}</p>}

          {!isTaxi && (
            <label>
              <span className={styles.fieldLabel}>Select a car</span>
              <select
                className={styles.select}
                value={values.carName}
                onChange={(e) => set("carName", e.target.value)}
                aria-invalid={Boolean(errors.carName)}
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
              <span className={styles.fieldLabel}>Pickup date &amp; time</span>
              <input
                type="datetime-local"
                step={900}
                min={minPickup || undefined}
                className={styles.input}
                value={values.pickupDate}
                onChange={(e) => set("pickupDate", e.target.value)}
                aria-invalid={Boolean(errors.pickupDate)}
              />
            </label>

            {!isTaxi && (
              <label>
                <span className={styles.fieldLabel}>Drop-off date &amp; time</span>
                <input
                  type="datetime-local"
                  step={900}
                  min={values.pickupDate || minPickup || undefined}
                  className={styles.input}
                  value={values.dropoffDate}
                  onChange={(e) => set("dropoffDate", e.target.value)}
                  aria-invalid={Boolean(errors.dropoffDate)}
                />
              </label>
            )}
          </div>
          {(errors.pickupDate || errors.dropoffDate) && (
            <p className={styles.error}>
              {[errors.pickupDate, errors.dropoffDate].filter(Boolean).join(" ")}
            </p>
          )}
          {!isTaxi && rentalTotal && (
            <p className={styles.hint}>
              {rentalTotal.days} {rentalTotal.days === 1 ? "day" : "days"} ·{" "}
              {rentalTotal.total === null
                ? "contact us for a quote"
                : `estimated total ${formatRate(rentalTotal.total)}`}
            </p>
          )}

          <div className={styles.flex}>
            <label>
              <span className={styles.fieldLabel}>Pickup location</span>
              <select
                className={styles.select}
                value={values.pickupLocation}
                onChange={(e) => set("pickupLocation", e.target.value)}
                aria-invalid={Boolean(errors.pickupLocation)}
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
              <span className={styles.fieldLabel}>
                {isTaxi ? "Destination" : "Drop-off location (optional)"}
              </span>
              <select
                className={styles.select}
                value={values.dropoffLocation}
                onChange={(e) => set("dropoffLocation", e.target.value)}
                aria-invalid={Boolean(errors.dropoffLocation)}
              >
                <option value="">{isTaxi ? "Where to?" : "Same as pickup"}</option>
                {isTaxi ? (
                  <>
                    <optgroup label="Fixed-price transfers">
                      {taxiDestinations.map((d) => (
                        <option key={d} value={d}>
                          {d}
                          {taxiTier ? ` — ${formatPrice(getTransferPrice(d, passengersNum))}` : ""}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Around Pafos">
                      {pafosAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </optgroup>
                    <option value={OTHER_DESTINATION}>{OTHER_DESTINATION}</option>
                  </>
                ) : (
                  pafosAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))
                )}
              </select>
            </label>
          </div>
          {(errors.pickupLocation || errors.dropoffLocation) && (
            <p className={styles.error}>
              {[errors.pickupLocation, errors.dropoffLocation].filter(Boolean).join(" ")}
            </p>
          )}

          {isTaxi && values.dropoffLocation && (
            <p className={styles.hint}>
              {taxiPrice !== null
                ? `Fixed price: ${formatPrice(taxiPrice)} per ${taxiTier?.vehicle.toLowerCase() ?? "vehicle"}, one-way`
                : taxiIsOther
                ? "We'll send you a quote for this destination."
                : "Local ride — we'll confirm the fare when we call you."}
            </p>
          )}

          <button type="button" onClick={goNext} className={styles.submit}>
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
                maxLength={60}
                autoComplete="given-name"
                className={styles.input}
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              <span>First name</span>
            </label>

            <label>
              <input
                placeholder=" "
                type="text"
                maxLength={60}
                autoComplete="family-name"
                className={styles.input}
                value={values.surname}
                onChange={(e) => set("surname", e.target.value)}
                aria-invalid={Boolean(errors.surname)}
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
                min={values.type === "car" ? MIN_AGE : 1}
                max={MAX_AGE}
                inputMode="numeric"
                className={styles.input}
                value={values.age}
                onChange={(e) => set("age", e.target.value)}
                aria-invalid={Boolean(errors.age)}
              />
              <span>{values.type === "car" ? `Age (min ${MIN_AGE})` : "Age"}</span>
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
                    {countryFlag(country.iso2)} {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <input
              placeholder=" "
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={20}
              className={styles.input}
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
            <span>Phone number ({values.phoneCountry})</span>
          </label>
          {errors.age && <p className={styles.error}>{errors.age}</p>}
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}

          <label>
            <input
              placeholder=" "
              type="email"
              autoComplete="email"
              maxLength={120}
              className={styles.input}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            <span>Email (optional)</span>
          </label>
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={goBack} className={styles.secondary}>
              Back
            </button>
            <button type="button" onClick={goNext} className={styles.submit}>
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
                {rentalTotal.days === 1 ? "day" : "days"} ·{" "}
                {formatDateTime(localInputToDate(values.pickupDate))} →{" "}
                {formatDateTime(localInputToDate(values.dropoffDate))}
              </p>
              <p className={styles.priceSummaryTotal}>
                {rentalTotal.total === null
                  ? "Contact us for a quote"
                  : `Total: ${formatRate(rentalTotal.total)}`}
              </p>
            </div>
          )}
          {isTaxi && (
            <div className={styles.priceSummary}>
              <p className={styles.priceSummaryLabel}>
                {taxiTier?.vehicle ?? "Taxi"} · {values.passengers}{" "}
                {passengersNum === 1 ? "person" : "people"} · {values.pickupLocation} →{" "}
                {values.dropoffLocation} · {formatDateTime(localInputToDate(values.pickupDate))}
              </p>
              <p className={styles.priceSummaryTotal}>
                {taxiPrice !== null ? `Fixed price: ${formatPrice(taxiPrice)}` : "Price confirmed by phone"}
              </p>
            </div>
          )}

          <div className={styles.review}>
            {reviewRows.map((row) => (
              <div key={row.label} className={styles.reviewRow}>
                <span className={styles.reviewLabel}>{row.label}</span>
                <span className={styles.reviewValue}>
                  {row.value}{" "}
                  <button type="button" className={styles.editLink} onClick={() => setStep(row.step)}>
                    Edit
                  </button>
                </span>
              </div>
            ))}
          </div>

          <label>
            <textarea
              rows={3}
              maxLength={500}
              placeholder=" "
              className={styles.input}
              value={values.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
            <span>Notes (optional)</span>
          </label>
          {errors.notes && <p className={styles.error}>{errors.notes}</p>}

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={values.agreedToTerms}
              onChange={(e) => set("agreedToTerms", e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a
                href="/angelova-terms-and-conditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="underline underline-offset-2 hover:text-brand-dark"
              >
                terms &amp; conditions
              </a>{" "}
              and confirm the details above are correct.
            </span>
          </label>
          {errors.agreedToTerms && <p className={styles.error}>{errors.agreedToTerms}</p>}
          {errors.type && <p className={styles.error}>{errors.type}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={goBack} className={styles.secondary}>
              Back
            </button>
            <button type="submit" disabled={pending} className={styles.submit}>
              {pending ? "Submitting…" : isTaxi ? "Request taxi" : "Finish & submit"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

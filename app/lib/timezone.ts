// The business operates in Cyprus. All customer-facing dates are entered and
// displayed in Europe/Nicosia regardless of where the server (Vercel = UTC)
// or the visitor's browser happens to be. Safe to import on client and server.

export const BUSINESS_TIME_ZONE = "Europe/Nicosia";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// What wall-clock time (as a UTC-based epoch) does `date` show in Nicosia?
function zonedEpoch(date: Date): number {
  const p: Record<string, number> = {};
  for (const { type, value } of partsFormatter.formatToParts(date)) {
    if (type !== "literal") p[type] = Number(value);
  }
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}

/**
 * Convert a `<input type="datetime-local">` value ("2026-09-01T10:00"),
 * meaning 10:00 in Nicosia, to a real instant. Returns null if invalid.
 */
export function localInputToDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  const wall = Date.UTC(+y, +mo - 1, +d, +h, +mi, s ? +s : 0);
  // First guess: treat the wall time as UTC, then correct by the zone offset
  // at that guess. A second pass fixes the rare DST-boundary case.
  let guess = wall - (zonedEpoch(new Date(wall)) - wall);
  guess = wall - (zonedEpoch(new Date(guess)) - guess);
  const date = new Date(guess);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Inverse of localInputToDate: instant -> "YYYY-MM-DDTHH:mm" in Nicosia. */
export function dateToLocalInput(date: Date): string {
  const p: Record<string, string> = {};
  for (const { type, value } of partsFormatter.formatToParts(date)) {
    if (type !== "literal") p[type] = value;
  }
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** "YYYY-MM-DDTHH:mm" for right now in Nicosia (for `min=` on date inputs). */
export function nowLocalInput(): string {
  return dateToLocalInput(new Date());
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d;
}

/** e.g. "1 Sept 2026" — identical on server and client, no hydration drift. */
export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateFmt.format(toDate(d));
}

/** e.g. "1 Sept 2026, 10:00" (Cyprus time). */
export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateTimeFmt.format(toDate(d));
}

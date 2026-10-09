// Pure builder for the "new booking" notification email -- no I/O, so it can
// be unit-tested. Sending lives in notify.ts (server-only).

import { siteConfig } from "@/app/lib/site-config";
import { referenceOf } from "@/app/lib/admin/reference";
import { formatDateTime } from "@/app/lib/timezone";
import { quoteRental } from "@/app/lib/pricing";
import { PENDING_HOLD_HOURS } from "@/app/lib/availability-core";

export type BookingEmailData = {
  id: string;
  type: "car" | "taxi";
  carName: string | null;
  name: string;
  surname: string;
  age: number;
  phone: string;
  email: string | null;
  pickupDate: Date;
  dropoffDate: Date | null;
  pickupLocation: string;
  dropoffLocation: string | null;
  passengers: number | null;
  notes: string | null;
};

export type BookingEmail = { subject: string; text: string; html: string };

// Every value below comes from the public booking form.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildBookingEmail(b: BookingEmailData): BookingEmail {
  const reference = referenceOf(b.id);
  const fullName = `${b.name} ${b.surname}`.trim();
  const adminUrl = `${siteConfig.url}/admin/reservations/${b.id}`;

  const rows: [string, string][] = [["Reference", reference]];
  if (b.type === "car") {
    const quote = b.carName ? quoteRental(b.carName, b.pickupDate, b.dropoffDate) : null;
    rows.push(
      ["Service", "Car rental"],
      ["Car", b.carName ?? "—"],
      ["Pickup", `${formatDateTime(b.pickupDate)} — ${b.pickupLocation}`],
      ["Drop-off", `${formatDateTime(b.dropoffDate)} — ${b.dropoffLocation || b.pickupLocation}`]
    );
    if (quote) {
      rows.push([
        "Estimate",
        quote.total === null
          ? `${quote.days} day(s) — rate on request`
          : `${quote.days} day(s) × €${quote.perDay} = €${quote.total}`,
      ]);
    }
  } else {
    rows.push(
      ["Service", "Taxi"],
      ["Pickup", `${formatDateTime(b.pickupDate)} — ${b.pickupLocation}`],
      ["Destination", b.dropoffLocation ?? "—"],
      ["Passengers", String(b.passengers ?? "—")]
    );
  }
  rows.push(
    ["Name", fullName],
    ["Age", String(b.age)],
    ["Phone", b.phone],
    ["Email", b.email || "—"],
    ["Notes", b.notes || "—"]
  );

  const what = b.type === "car" ? b.carName ?? "Car rental" : `Taxi to ${b.dropoffLocation ?? "—"}`;
  const subject = `New booking ${reference}: ${what} — ${fullName}, ${formatDateTime(b.pickupDate)}`;

  const text = [
    "New booking request on the website.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Open in admin: ${adminUrl}`,
    `Unconfirmed car bookings expire after ${PENDING_HOLD_HOURS} hours.`,
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
    )
    .join("");
  const phoneHref = `tel:${b.phone.replace(/[^\d+]/g, "")}`;
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">` +
    `<h2 style="margin:0 0 12px">New booking request</h2>` +
    `<table style="border-collapse:collapse">${htmlRows}</table>` +
    `<p style="margin:16px 0 0">` +
    `<a href="${escapeHtml(adminUrl)}">Open in admin</a> · ` +
    `<a href="${escapeHtml(phoneHref)}">Call ${escapeHtml(fullName)}</a></p>` +
    `<p style="color:#666;font-size:13px">Unconfirmed car bookings expire after ${PENDING_HOLD_HOURS} hours.</p>` +
    `</div>`;

  return { subject, text, html };
}

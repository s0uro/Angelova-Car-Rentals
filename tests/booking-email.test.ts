import { describe, expect, it } from "vitest";
import { buildBookingEmail, type BookingEmailData } from "@/app/lib/booking-email";
import { fleet } from "@/app/lib/fleet-data";

const base: BookingEmailData = {
  id: "clxyz0000000000abcd1234",
  type: "car",
  carName: fleet[0].name,
  name: "Maria",
  surname: "Ioannou",
  age: 30,
  phone: "+35799123456",
  email: "maria@example.com",
  pickupDate: new Date("2026-09-01T07:00:00Z"),
  dropoffDate: new Date("2026-09-04T07:00:00Z"),
  pickupLocation: "Pafos International Airport",
  dropoffLocation: null,
  passengers: null,
  notes: null,
};

describe("buildBookingEmail", () => {
  it("summarises a car booking with reference, dates and estimate", () => {
    const { subject, text } = buildBookingEmail(base);
    expect(subject).toContain("ABCD1234");
    expect(subject).toContain(fleet[0].name);
    expect(text).toContain("Pickup: 1 Sept 2026, 10:00 — Pafos International Airport");
    expect(text).toContain("Estimate: 3 day(s)");
    expect(text).toContain("/admin/reservations/clxyz0000000000abcd1234");
  });

  it("summarises a taxi booking", () => {
    const { subject, text } = buildBookingEmail({
      ...base,
      type: "taxi",
      carName: null,
      dropoffDate: null,
      dropoffLocation: "Coral Bay",
      passengers: 3,
    });
    expect(subject).toContain("Taxi to Coral Bay");
    expect(text).toContain("Passengers: 3");
    expect(text).not.toContain("Estimate");
  });

  it("escapes customer input in the HTML body", () => {
    const { html } = buildBookingEmail({ ...base, notes: '<script>alert("x")</script>' });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

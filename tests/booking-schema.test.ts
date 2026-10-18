import { describe, expect, it } from "vitest";
import { fleet } from "@/app/lib/fleet-data";
import { reservationSchema } from "@/app/lib/booking-schema";
import { OFFICE_LOCATION } from "@/app/lib/site-config";

const DAY = 24 * 60 * 60 * 1000;
const carBooking = (pickupLocation: string, dropoffLocation: string) => ({
  type: "car",
  carName: fleet[0].name,
  pickupDate: new Date(Date.now() + DAY).toISOString(),
  dropoffDate: new Date(Date.now() + 3 * DAY).toISOString(),
  pickupLocation,
  dropoffLocation,
  name: "Test",
  surname: "User",
  age: "30",
  phone: "+35799000000",
  email: "test@example.com",
  agreedToTerms: true,
});

describe("car rental locations", () => {
  it("accepts pickup and drop-off at the office", () => {
    expect(reservationSchema.safeParse(carBooking(OFFICE_LOCATION, OFFICE_LOCATION)).success).toBe(true);
    expect(reservationSchema.safeParse(carBooking(OFFICE_LOCATION, "")).success).toBe(true);
  });

  it("rejects any other pickup or drop-off area", () => {
    expect(reservationSchema.safeParse(carBooking("Coral Bay", OFFICE_LOCATION)).success).toBe(false);
    expect(reservationSchema.safeParse(carBooking(OFFICE_LOCATION, "Coral Bay")).success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { composePhone } from "@/app/lib/phone";
import { reservationSchema } from "@/app/lib/booking-schema";

describe("composePhone", () => {
  it("prefixes the selected country code", () => {
    expect(composePhone("+357", "99 123456")).toBe("+35799 123456");
  });

  it("drops a national trunk 0", () => {
    expect(composePhone("+44", "07700 900123")).toBe("+447700 900123");
  });

  it("keeps Italy's leading 0, which is part of the number", () => {
    expect(composePhone("+39", "06 1234 5678")).toBe("+3906 1234 5678");
  });

  it("keeps a number typed in international form", () => {
    expect(composePhone("+357", "+44 7700 900123")).toBe("+44 7700 900123");
    expect(composePhone("+357", "0044 7700 900123")).toBe("+44 7700 900123");
  });

  it("returns empty for empty input so 'required' still fires", () => {
    expect(composePhone("+357", "   ")).toBe("");
  });

  it("produces numbers the booking schema accepts", () => {
    const phone = reservationSchema.shape.phone;
    expect(phone.safeParse(composePhone("+357", "+357 99 123456")).success).toBe(true);
    expect(phone.parse(composePhone("+44", "07700 900123"))).toBe("+447700900123");
  });
});

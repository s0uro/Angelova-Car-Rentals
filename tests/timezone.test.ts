import { describe, expect, it } from "vitest";
import { localInputToDate, dateToLocalInput, formatDateTime } from "@/app/lib/timezone";

describe("localInputToDate (Europe/Nicosia)", () => {
  it("treats summer input as UTC+3", () => {
    expect(localInputToDate("2026-09-01T10:00")?.toISOString()).toBe("2026-09-01T07:00:00.000Z");
  });

  it("treats winter input as UTC+2", () => {
    expect(localInputToDate("2026-12-15T10:00")?.toISOString()).toBe("2026-12-15T08:00:00.000Z");
  });

  it("rejects malformed input", () => {
    expect(localInputToDate("not-a-date")).toBeNull();
    expect(localInputToDate("2026-09-01")).toBeNull();
  });

  it("round-trips back to the same wall-clock string", () => {
    for (const value of ["2026-01-05T00:15", "2026-07-20T23:45", "2026-10-25T03:30"]) {
      expect(dateToLocalInput(localInputToDate(value)!)).toBe(value);
    }
  });
});

describe("formatDateTime", () => {
  it("renders an instant in Cyprus time regardless of the host zone", () => {
    expect(formatDateTime(new Date("2026-09-01T07:00:00Z"))).toContain("10:00");
  });

  it("shows an em dash for missing dates", () => {
    expect(formatDateTime(null)).toBe("—");
  });
});

export const RESERVATION_STATUSES = ["new", "confirmed", "rejected"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

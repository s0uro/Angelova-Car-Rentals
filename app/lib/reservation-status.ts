export const RESERVATION_STATUSES = [
  "new",
  "confirmed",
  "rejected",
  "expired",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const INACTIVE_RESERVATION_STATUSES: ReservationStatus[] = [
  "rejected",
  "expired",
];

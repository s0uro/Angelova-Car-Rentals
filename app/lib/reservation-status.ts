export const RESERVATION_STATUSES = ["new", "confirmed", "rejected", "expired"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  new: "Pending",
  confirmed: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
};

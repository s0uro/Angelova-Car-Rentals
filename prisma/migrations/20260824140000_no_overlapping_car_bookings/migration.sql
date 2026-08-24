-- First reservation wins: reject any car reservation whose dates overlap an
-- existing one for the same car, unless that existing reservation was
-- rejected. This is a hard DB-level guarantee (on top of the app-level check
-- in app/actions/bookings.ts) so two people submitting at the same instant
-- can't both end up with the same car for the same dates.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- pickupDate/dropoffDate are TIMESTAMP (no time zone), so the range must be
-- built with tsrange, not tstzrange -- a tstzrange cast is timezone-dependent
-- (STABLE, not IMMUTABLE) and Postgres rejects non-immutable index expressions.
ALTER TABLE "Reservation"
  ADD CONSTRAINT "no_overlapping_car_bookings"
  EXCLUDE USING gist (
    "carName" WITH =,
    tsrange(
      "pickupDate",
      COALESCE("dropoffDate", "pickupDate" + interval '1 day'),
      '[)'
    ) WITH &&
  )
  WHERE (type = 'car' AND status != 'rejected' AND "carName" IS NOT NULL);

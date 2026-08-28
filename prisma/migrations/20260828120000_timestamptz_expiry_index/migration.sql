-- 1. Store instants, not naive timestamps.
--    Existing rows were written by parsing a Cyprus wall-clock time as UTC, so
--    their naive value IS the Cyprus local time: reinterpret it in
--    Europe/Nicosia. createdAt came from now() (real UTC).
-- 2. Add `expired` to the statuses that free a car.
-- 3. Index the availability query.

ALTER TABLE "Reservation" DROP CONSTRAINT IF EXISTS "no_overlapping_car_bookings";

ALTER TABLE "Reservation"
  ALTER COLUMN "pickupDate"  TYPE timestamptz(6) USING ("pickupDate"  AT TIME ZONE 'Europe/Nicosia'),
  ALTER COLUMN "dropoffDate" TYPE timestamptz(6) USING ("dropoffDate" AT TIME ZONE 'Europe/Nicosia'),
  ALTER COLUMN "createdAt"   TYPE timestamptz(6) USING ("createdAt"   AT TIME ZONE 'UTC');

-- tstzrange() is STABLE (depends on the session time zone), which Postgres
-- refuses inside an index/exclusion expression. Wrapping it in an IMMUTABLE
-- function is safe here because the inputs are absolute instants.
CREATE OR REPLACE FUNCTION booking_range(p timestamptz, d timestamptz)
RETURNS tstzrange
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT tstzrange(p, COALESCE(d, p + interval '1 day'), '[)');
$$;

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Reservation"
  ADD CONSTRAINT "no_overlapping_car_bookings"
  EXCLUDE USING gist (
    "carName" WITH =,
    booking_range("pickupDate", "dropoffDate") WITH &&
  )
  WHERE (type = 'car' AND status IN ('new', 'confirmed') AND "carName" IS NOT NULL);

CREATE INDEX IF NOT EXISTS "Reservation_carName_status_pickupDate_idx"
  ON "Reservation" ("carName", "status", "pickupDate");

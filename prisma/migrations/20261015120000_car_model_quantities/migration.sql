-- Several units of the same model (7 Nissan March, 4 Note e-Power, ...).
-- A model stays bookable for a date range until every unit is out at the same
-- moment, so the "one booking per model at a time" exclusion constraint is
-- replaced by a capacity check against CarModel.quantity.
--
-- Safe to apply before the code that uses it is deployed: the old code still
-- refuses any overlapping booking of a model itself, before it reaches the
-- database, so it simply keeps behaving as one unit per model until then.

CREATE TABLE "CarModel" (
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("name"),
    CONSTRAINT "CarModel_quantity_check" CHECK ("quantity" BETWEEN 0 AND 99)
);

-- Same as the other tables: no Supabase Data API access. The app connects as
-- the table owner, which RLS does not restrict.
ALTER TABLE "CarModel" ENABLE ROW LEVEL SECURITY;

-- Names match Reservation."carName" (title-cased from prices.json).
INSERT INTO "CarModel" ("name", "quantity") VALUES
    ('Nissan March', 7),
    ('Nissan Note', 2),
    ('Nissan Note E Power', 4),
    ('Toyota Vitz', 1),
    ('Honda Fit', 2),
    ('Mazda Demio', 3),
    ('Nissan Serena', 2),
    ('Nissan Serena E Power', 1),
    ('Mazda Cx5', 1),
    ('Toyota Chr', 1),
    ('Suzuki Jimny', 1)
ON CONFLICT ("name") DO UPDATE
    SET "quantity" = EXCLUDED."quantity", "updatedAt" = CURRENT_TIMESTAMP;

ALTER TABLE "Reservation" DROP CONSTRAINT IF EXISTS "no_overlapping_car_bookings";

-- Mirrors isCarAvailable() in app/lib/availability-core.ts, which gives the
-- customer a friendly error first. This is the final guard: it also covers two
-- people booking the last unit at the same instant.
CREATE OR REPLACE FUNCTION enforce_car_capacity() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  wanted tstzrange;
  units integer;
  busiest integer;
BEGIN
  IF NEW.type <> 'car' OR NEW."carName" IS NULL OR NEW.status NOT IN ('new', 'confirmed') THEN
    RETURN NEW;
  END IF;

  -- An update that keeps the booking where it was (accepting it, notes, the
  -- contacted flag) never re-checks: the booking already holds its unit.
  IF TG_OP = 'UPDATE'
     AND OLD.type = 'car'
     AND OLD.status IN ('new', 'confirmed')
     AND OLD."carName" IS NOT DISTINCT FROM NEW."carName"
     AND OLD."pickupDate" = NEW."pickupDate"
     AND OLD."dropoffDate" IS NOT DISTINCT FROM NEW."dropoffDate" THEN
    RETURN NEW;
  END IF;

  -- One booking of a model at a time: a concurrent one waits here until this
  -- transaction ends, then sees this row when it counts.
  PERFORM pg_advisory_xact_lock(hashtext('car_capacity'), hashtext(NEW."carName"));

  SELECT "quantity" INTO units FROM "CarModel" WHERE "name" = NEW."carName";
  units := COALESCE(units, 1);

  wanted := booking_range(NEW."pickupDate", NEW."dropoffDate");

  -- The most other bookings of this model out at the same moment during the
  -- wanted range. That number only goes up when a booking starts, so checking
  -- the start of the range and every start inside it is enough.
  WITH others AS (
    SELECT booking_range("pickupDate", "dropoffDate") AS r
    FROM "Reservation"
    WHERE type = 'car'
      AND "carName" = NEW."carName"
      AND status IN ('new', 'confirmed')
      AND id <> NEW.id
      AND "pickupDate" < upper(wanted)
      AND booking_range("pickupDate", "dropoffDate") && wanted
  )
  SELECT COALESCE(MAX(n), 0) INTO busiest
  FROM (
    SELECT (SELECT count(*) FROM others o WHERE o.r @> GREATEST(lower(s.r), lower(wanted))) AS n
    FROM others s
  ) AS counts;

  IF busiest >= units THEN
    RAISE EXCEPTION 'car_fully_booked: every % is already booked for these dates', NEW."carName"
      USING ERRCODE = 'exclusion_violation', CONSTRAINT = 'car_capacity';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER "Reservation_enforce_car_capacity"
    BEFORE INSERT OR UPDATE OF type, "carName", status, "pickupDate", "dropoffDate"
    ON "Reservation"
    FOR EACH ROW EXECUTE FUNCTION enforce_car_capacity();

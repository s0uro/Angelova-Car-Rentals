ALTER TABLE "Reservation"
  ADD COLUMN "adminNotes" TEXT,
  ADD COLUMN "contactedAt" TIMESTAMPTZ(6);
CREATE INDEX IF NOT EXISTS "Reservation_phone_idx" ON "Reservation" ("phone");
CREATE INDEX IF NOT EXISTS "Reservation_status_createdAt_idx" ON "Reservation" ("status", "createdAt");

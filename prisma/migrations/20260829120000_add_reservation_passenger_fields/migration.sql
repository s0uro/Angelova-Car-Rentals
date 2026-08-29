-- These columns already exist in production (added outside Prisma), so this
-- migration uses IF NOT EXISTS to stay safe there while still bringing fresh
-- databases up to date.
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "passengers" INTEGER;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "contactedAt" TIMESTAMP(3);

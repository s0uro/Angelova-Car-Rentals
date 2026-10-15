-- Price quoted when the booking was made, in EUR (app/lib/quote.ts).
-- NULL = to be confirmed by phone, e.g. a taxi that doesn't start in Kato
-- Paphos. Rows from before this migration are NULL too; the admin recomputes
-- their price with the current rules.
ALTER TABLE "Reservation" ADD COLUMN "price" DECIMAL(10,2);

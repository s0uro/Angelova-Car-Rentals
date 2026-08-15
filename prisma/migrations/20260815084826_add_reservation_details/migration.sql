-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "carName" TEXT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL DEFAULT '',
    "age" INTEGER NOT NULL DEFAULT 25,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "pickupDate" DATETIME NOT NULL,
    "dropoffDate" DATETIME,
    "pickupLocation" TEXT NOT NULL,
    "dropoffLocation" TEXT,
    "notes" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reservation" ("createdAt", "dropoffDate", "dropoffLocation", "email", "id", "name", "notes", "phone", "pickupDate", "pickupLocation", "status", "type") SELECT "createdAt", "dropoffDate", "dropoffLocation", "email", "id", "name", "notes", "phone", "pickupDate", "pickupLocation", "status", "type" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "carName" TEXT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL DEFAULT '',
    "age" INTEGER NOT NULL DEFAULT 25,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "dropoffDate" TIMESTAMP(3),
    "pickupLocation" TEXT NOT NULL,
    "dropoffLocation" TEXT,
    "notes" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

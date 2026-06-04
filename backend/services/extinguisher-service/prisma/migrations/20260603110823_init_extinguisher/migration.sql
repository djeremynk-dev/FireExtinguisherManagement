-- CreateEnum
CREATE TYPE "ExtinguisherType" AS ENUM ('WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL');

-- CreateEnum
CREATE TYPE "ExtinguisherSize" AS ENUM ('LB_2_5', 'LB_5', 'LB_9', 'LB_12');

-- CreateEnum
CREATE TYPE "ExtinguisherStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'NEEDS_INSPECTION', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateTable
CREATE TABLE "fire_extinguishers" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" "ExtinguisherType" NOT NULL,
    "size" "ExtinguisherSize" NOT NULL,
    "installationDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "status" "ExtinguisherStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fire_extinguishers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fire_extinguishers_serialNumber_key" ON "fire_extinguishers"("serialNumber");

-- CreateIndex
CREATE INDEX "fire_extinguishers_serialNumber_idx" ON "fire_extinguishers"("serialNumber");

-- CreateIndex
CREATE INDEX "fire_extinguishers_status_idx" ON "fire_extinguishers"("status");

-- CreateIndex
CREATE INDEX "fire_extinguishers_location_idx" ON "fire_extinguishers"("location");

-- CreateEnum
CREATE TYPE "ExtinguisherStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'NEEDS_INSPECTION', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InspectionOutcome" AS ENUM ('PASSED', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "extinguisher_snapshots" (
    "id" TEXT NOT NULL,
    "extinguisherId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "ExtinguisherStatus" NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "buildingName" TEXT,
    "lastInspectionAt" TIMESTAMP(3),
    "lastServiceAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extinguisher_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_snapshots" (
    "id" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "extinguisherId" TEXT NOT NULL,
    "status" "InspectionStatus" NOT NULL,
    "outcome" "InspectionOutcome" NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_snapshots" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "extinguisherId" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "extinguisher_snapshots_extinguisherId_idx" ON "extinguisher_snapshots"("extinguisherId");

-- CreateIndex
CREATE INDEX "extinguisher_snapshots_status_idx" ON "extinguisher_snapshots"("status");

-- CreateIndex
CREATE INDEX "extinguisher_snapshots_expiryDate_idx" ON "extinguisher_snapshots"("expiryDate");

-- CreateIndex
CREATE INDEX "inspection_snapshots_inspectionId_idx" ON "inspection_snapshots"("inspectionId");

-- CreateIndex
CREATE INDEX "inspection_snapshots_extinguisherId_idx" ON "inspection_snapshots"("extinguisherId");

-- CreateIndex
CREATE INDEX "inspection_snapshots_status_idx" ON "inspection_snapshots"("status");

-- CreateIndex
CREATE INDEX "inspection_snapshots_scheduledDate_idx" ON "inspection_snapshots"("scheduledDate");

-- CreateIndex
CREATE INDEX "maintenance_snapshots_maintenanceId_idx" ON "maintenance_snapshots"("maintenanceId");

-- CreateIndex
CREATE INDEX "maintenance_snapshots_extinguisherId_idx" ON "maintenance_snapshots"("extinguisherId");

-- CreateIndex
CREATE INDEX "maintenance_snapshots_status_idx" ON "maintenance_snapshots"("status");

-- CreateIndex
CREATE INDEX "maintenance_snapshots_serviceDate_idx" ON "maintenance_snapshots"("serviceDate");

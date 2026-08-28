CREATE TYPE "Role" AS ENUM ('ADMIN', 'CHC_MANAGER', 'OPERATOR', 'FARMER');
CREATE TYPE "MachineStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'BROKEN');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "FarmerRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');
CREATE TYPE "VoiceStatus" AS ENUM ('PROCESSING', 'CONFIRMED', 'REJECTED');
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE "ProposalReason" AS ENUM ('BREAKDOWN', 'DELAY', 'CANCELLATION', 'URGENT_JOB');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "chclId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Machine" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "MachineStatus" NOT NULL DEFAULT 'ACTIVE',
  "chclId" TEXT NOT NULL,
  "operatorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
  "id" TEXT NOT NULL,
  "farmerId" TEXT NOT NULL,
  "machineId" TEXT NOT NULL,
  "operatorId" TEXT,
  "areaInAcres" DOUBLE PRECISION NOT NULL,
  "cropType" TEXT,
  "location" JSONB NOT NULL,
  "scheduledStart" TIMESTAMP(3) NOT NULL,
  "scheduledEnd" TIMESTAMP(3) NOT NULL,
  "predictedDurationMinutes" INTEGER,
  "actualStart" TIMESTAMP(3),
  "actualEnd" TIMESTAMP(3),
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "specialInstructions" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Booking_scheduledStart_idx" ON "Booking"("scheduledStart");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_machineId_scheduledStart_idx" ON "Booking"("machineId", "scheduledStart");

CREATE TABLE "VoiceRecording" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT,
  "audioUrl" TEXT NOT NULL,
  "transcript" TEXT,
  "extractedData" JSONB,
  "status" "VoiceStatus" NOT NULL DEFAULT 'PROCESSING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VoiceRecording_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ScheduleChangeProposal" (
  "id" TEXT NOT NULL,
  "reason" "ProposalReason" NOT NULL,
  "proposedChanges" JSONB NOT NULL,
  "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ScheduleChangeProposal_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Machine" ADD CONSTRAINT "Machine_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VoiceRecording" ADD CONSTRAINT "VoiceRecording_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "village" TEXT;
ALTER TABLE "User" ADD COLUMN "address" TEXT;

CREATE TABLE "FarmerRequest" (
  "id" TEXT NOT NULL,
  "farmerId" TEXT NOT NULL,
  "requestedMachineType" TEXT NOT NULL,
  "areaInAcres" DOUBLE PRECISION NOT NULL,
  "preferredDate" TIMESTAMP(3) NOT NULL,
  "preferredTimeWindow" TEXT,
  "location" JSONB NOT NULL,
  "status" "FarmerRequestStatus" NOT NULL DEFAULT 'PENDING',
  "cropType" TEXT,
  "specialInstructions" TEXT,
  "bookingId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FarmerRequest_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "FarmerRequest_bookingId_key" ON "FarmerRequest"("bookingId");

CREATE TABLE "JobDurationTrainingSample" (
  "id" TEXT NOT NULL,
  "machineType" TEXT NOT NULL,
  "areaInAcres" DOUBLE PRECISION NOT NULL,
  "cropType" TEXT,
  "location" JSONB,
  "season" TEXT,
  "actualDurationMinutes" INTEGER NOT NULL,
  "bookingId" TEXT,
  "operatorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "JobDurationTrainingSample_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FarmerRequest" ADD CONSTRAINT "FarmerRequest_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FarmerRequest" ADD CONSTRAINT "FarmerRequest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "JobDurationTrainingSample" ADD CONSTRAINT "JobDurationTrainingSample_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "JobDurationTrainingSample" ADD CONSTRAINT "JobDurationTrainingSample_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TYPE "FarmerNotificationType" AS ENUM ('REQUEST_APPROVED', 'JOB_ASSIGNED', 'JOB_SCHEDULED', 'JOB_RESCHEDULED', 'JOB_COMPLETED', 'JOB_CANCELLED');
CREATE TABLE "FarmerNotification" (
  "id" TEXT NOT NULL,
  "farmerId" TEXT NOT NULL,
  "type" "FarmerNotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "relatedRequestId" TEXT,
  "relatedBookingId" TEXT,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FarmerNotification_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "FarmerNotification" ADD CONSTRAINT "FarmerNotification_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FarmerNotification" ADD CONSTRAINT "FarmerNotification_relatedRequestId_fkey" FOREIGN KEY ("relatedRequestId") REFERENCES "FarmerRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FarmerNotification" ADD CONSTRAINT "FarmerNotification_relatedBookingId_fkey" FOREIGN KEY ("relatedBookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "OperatorLocation" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "operatorId" TEXT NOT NULL,
  "lat" DOUBLE PRECISION NOT NULL,
  "lng" DOUBLE PRECISION NOT NULL,
  "speed" DOUBLE PRECISION,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OperatorLocation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "OperatorLocation_bookingId_timestamp_idx" ON "OperatorLocation"("bookingId", "timestamp");
ALTER TABLE "OperatorLocation" ADD CONSTRAINT "OperatorLocation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperatorLocation" ADD CONSTRAINT "OperatorLocation_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

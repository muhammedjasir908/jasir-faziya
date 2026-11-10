-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('BOTH_EVENTS', 'RECEPTION_ONLY');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('ACTIVE', 'DISABLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "invitation_type" "InvitationType" NOT NULL,
    "max_attendees" INTEGER NOT NULL DEFAULT 1,
    "status" "InvitationStatus" NOT NULL DEFAULT 'ACTIVE',
    "token_hash" TEXT NOT NULL,
    "token_cipher" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE,
    "time_label" TEXT,
    "venue" TEXT,
    "address" TEXT,
    "map_url" TEXT,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_event_access" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_event_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_rsvps" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "status" "RsvpStatus" NOT NULL,
    "attendee_count" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guests_token_hash_key" ON "guests"("token_hash");

-- CreateIndex
CREATE INDEX "guests_invitation_type_idx" ON "guests"("invitation_type");

-- CreateIndex
CREATE INDEX "guests_status_idx" ON "guests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "guest_event_access_event_id_idx" ON "guest_event_access"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "guest_event_access_guest_id_event_id_key" ON "guest_event_access"("guest_id", "event_id");

-- CreateIndex
CREATE INDEX "guest_rsvps_event_id_status_idx" ON "guest_rsvps"("event_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "guest_rsvps_guest_id_event_id_key" ON "guest_rsvps"("guest_id", "event_id");

-- AddForeignKey
ALTER TABLE "guest_event_access" ADD CONSTRAINT "guest_event_access_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_event_access" ADD CONSTRAINT "guest_event_access_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_rsvps" ADD CONSTRAINT "guest_rsvps_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_rsvps" ADD CONSTRAINT "guest_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

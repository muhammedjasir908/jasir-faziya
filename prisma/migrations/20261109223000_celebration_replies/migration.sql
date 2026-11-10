CREATE TABLE "celebration_replies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "event_slug" TEXT NOT NULL,
    "status" "RsvpStatus" NOT NULL,
    "attendee_count" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "celebration_replies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "celebration_replies_name_key_event_slug_key" ON "celebration_replies"("name_key", "event_slug");
CREATE INDEX "celebration_replies_event_slug_status_idx" ON "celebration_replies"("event_slug", "status");

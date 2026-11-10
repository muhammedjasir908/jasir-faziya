import "server-only";

import { z } from "zod";

import { getPrisma } from "@/lib/db";
import { AppError } from "@/lib/errors";

const replySchema = z.object({
  name: z.string().trim().min(2, "Please write your name.").max(120),
  eventSlug: z.enum(["nikah", "reception"]),
  status: z.enum(["ACCEPTED", "DECLINED"]),
  attendeeCount: z.number().int().min(0).max(10),
  message: z.string().trim().max(1000).optional().nullable(),
});

export async function saveCelebrationReply(body: unknown) {
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Please check your reply.", 400);
  }
  const name = parsed.data.name.replace(/\s+/g, " ");
  const attendeeCount = parsed.data.status === "DECLINED" ? 0 : Math.max(1, parsed.data.attendeeCount);
  if (parsed.data.status === "ACCEPTED" && attendeeCount > 10) {
    throw new AppError("Please choose between 1 and 10 guests.", 400);
  }
  const prisma = getPrisma();
  const reply = await prisma.celebrationReply.upsert({
    where: {
      nameKey_eventSlug: {
        nameKey: name.toLowerCase(),
        eventSlug: parsed.data.eventSlug,
      },
    },
    create: {
      name,
      nameKey: name.toLowerCase(),
      eventSlug: parsed.data.eventSlug,
      status: parsed.data.status,
      attendeeCount,
      message: parsed.data.message || null,
    },
    update: {
      name,
      status: parsed.data.status,
      attendeeCount,
      message: parsed.data.message || null,
    },
  });
  return {
    name: reply.name,
    eventSlug: reply.eventSlug,
    status: reply.status,
    attendeeCount: reply.attendeeCount,
    message: reply.message,
  };
}

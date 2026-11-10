import assert from "node:assert/strict";
import test from "node:test";

import { eventMoment } from "../lib/format";
import { normalizeRsvp, toPublicInvitation } from "../lib/invitation-policy";
import { invitationShareText } from "../lib/share-text";
import { decryptToken, encryptToken, generateToken, hashToken, isWellFormedToken } from "../lib/tokens";
import type { PolicyEvent } from "../lib/invitation-policy";

process.env.AUTH_SECRET = "test-secret-please-change";

function event(overrides: Partial<PolicyEvent> & Pick<PolicyEvent, "id" | "slug">): PolicyEvent {
  return {
    title: overrides.slug,
    date: null,
    timeLabel: null,
    venue: null,
    address: null,
    mapUrl: null,
    notes: null,
    sortOrder: overrides.slug === "nikah" ? 1 : 2,
    ...overrides,
  };
}

const nikah = event({
  id: "evt-nikah",
  slug: "nikah",
  title: "Nikah",
  date: new Date(Date.UTC(2026, 11, 1)),
  timeLabel: "10:00 AM",
  venue: "Private Nikah Hall",
  address: "A street that must stay hidden",
  notes: "Bring the nikah documents",
});

const reception = event({
  id: "evt-reception",
  slug: "reception",
  title: "Reception",
  date: new Date(Date.UTC(2026, 11, 6)),
  timeLabel: "11:00 AM",
  venue: "AMANATH Convention Centre",
});

test("reception-only invitations exclude every Nikah detail", () => {
  const invitation = toPublicInvitation(
    {
      name: "Amina Rahman",
      invitationType: "RECEPTION_ONLY",
      maxAttendees: 3,
      eventAccess: [{ event: nikah }, { event: reception }],
      rsvps: [
        { eventId: nikah.id, status: "ACCEPTED", attendeeCount: 2, message: "See you at the nikah" },
        { eventId: reception.id, status: "DECLINED", attendeeCount: 0, message: null },
      ],
    },
    "Asia/Kolkata",
  );

  const serialized = JSON.stringify(invitation).toLowerCase();
  assert.equal(serialized.includes("nikah"), false);
  assert.equal(invitation.events.length, 1);
  assert.equal(invitation.events[0]?.slug, "reception");
  assert.equal(invitation.events[0]?.rsvp?.status, "DECLINED");
  assert.equal(invitation.countdownTo, eventMoment("2026-12-06", "11:00 AM", "Asia/Kolkata"));
});

test("both-events invitations keep each celebration and its own reply", () => {
  const invitation = toPublicInvitation(
    {
      name: "Yusuf Ali",
      invitationType: "BOTH_EVENTS",
      maxAttendees: 4,
      eventAccess: [{ event: reception }, { event: nikah }],
      rsvps: [{ eventId: nikah.id, status: "ACCEPTED", attendeeCount: 2, message: "In sha Allah" }],
    },
    "Asia/Kolkata",
  );

  assert.deepEqual(
    invitation.events.map((item) => item.slug),
    ["nikah", "reception"],
  );
  assert.equal(invitation.events[0]?.rsvp?.attendeeCount, 2);
  assert.equal(invitation.events[1]?.rsvp, null);
  assert.equal(invitation.countdownTo, eventMoment("2026-12-01", "10:00 AM", "Asia/Kolkata"));
});

test("event moments use the wedding timezone", () => {
  assert.equal(eventMoment("2026-12-06", "11:00 AM", "Asia/Kolkata"), "2026-12-06T05:30:00.000Z");
});

test("replies cannot exceed the guest limit or duplicate a decline", () => {
  assert.deepEqual(normalizeRsvp({ status: "DECLINED", attendeeCount: 8, maxAttendees: 2 }), {
    ok: true,
    status: "DECLINED",
    attendeeCount: 0,
  });
  assert.equal(normalizeRsvp({ status: "ACCEPTED", attendeeCount: 0, maxAttendees: 2 }).ok, false);
  assert.equal(normalizeRsvp({ status: "ACCEPTED", attendeeCount: 3, maxAttendees: 2 }).ok, false);
  assert.deepEqual(normalizeRsvp({ status: "ACCEPTED", attendeeCount: 2, maxAttendees: 2 }), {
    ok: true,
    status: "ACCEPTED",
    attendeeCount: 2,
  });
});

test("share text follows the invitation type", () => {
  const receptionText = invitationShareText("Amina", "https://example.com/invite/abc", "RECEPTION_ONLY");
  const bothText = invitationShareText("Amina", "https://example.com/invite/abc", "BOTH_EVENTS");
  assert.equal(receptionText.toLowerCase().includes("nikah"), false);
  assert.equal(bothText.includes("Nikah"), true);
  assert.equal(receptionText.includes("https://example.com/invite/abc"), true);
});

test("tokens are unguessable and can be stored without the raw value", () => {
  const tokens = new Set(Array.from({ length: 30 }, () => generateToken()));
  assert.equal(tokens.size, 30);
  for (const token of tokens) {
    assert.equal(isWellFormedToken(token), true);
    assert.equal(hashToken(token).length, 64);
    assert.equal(decryptToken(encryptToken(token)), token);
  }
  assert.equal(isWellFormedToken("short"), false);
  assert.equal(isWellFormedToken("0000000000"), false);
});

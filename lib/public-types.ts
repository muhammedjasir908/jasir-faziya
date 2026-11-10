export type RsvpChoice = "ACCEPTED" | "DECLINED";

export type PublicRsvp = {
  status: RsvpChoice;
  attendeeCount: number;
  message: string | null;
};

export type PublicEvent = {
  slug: string;
  title: string;
  date: string | null;
  dateLabel: string | null;
  timeLabel: string | null;
  venue: string | null;
  address: string | null;
  mapUrl: string | null;
  notes: string | null;
  rsvp: PublicRsvp | null;
};

export type PublicInvitation = {
  guestName: string;
  maxAttendees: number;
  events: PublicEvent[];
  countdownTo: string | null;
};

export type InvitationAccess = "BOTH_EVENTS" | "RECEPTION_ONLY";
export type InvitationState = "ACTIVE" | "DISABLED" | "EXPIRED";

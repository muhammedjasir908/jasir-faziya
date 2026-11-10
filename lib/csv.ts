import type { RsvpRow } from "@/lib/reporting";

function csvCell(value: string | number | null | undefined) {
  const raw = value == null ? "" : String(value);
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  if (/[",\n\r]/.test(safe)) return `"${safe.replaceAll('"', '""')}"`;
  return safe;
}

export function rsvpCsv(rows: RsvpRow[]) {
  const header = [
    "Guest name",
    "Phone",
    "Invitation",
    "Max guests",
    "Invitation status",
    "Event",
    "Reply",
    "Attendees",
    "Message",
    "Reply updated",
  ];
  const body = rows.map((row) => [
    row.guestName,
    row.phone ?? "",
    row.invitationType === "BOTH_EVENTS" ? "Both events" : "Reception only",
    row.maxAttendees,
    row.invitationStatus,
    row.eventTitle,
    row.response === "ACCEPTED" ? "Accepted" : row.response === "DECLINED" ? "Declined" : "Pending",
    row.attendeeCount ?? "",
    row.message ?? "",
    row.updatedAt ?? "",
  ]);
  return `\uFEFF${[header, ...body].map((line) => line.map(csvCell).join(",")).join("\r\n")}`;
}

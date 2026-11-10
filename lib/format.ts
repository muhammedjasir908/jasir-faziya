import { DEFAULT_TIMEZONE, WEDDING_DATE_ISO } from "@/lib/constants";

export function toDateInput(value: Date | null | undefined) {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

export function formatLongDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, (month ?? 1) - 1, day)));
}

export function weddingDateParts(isoDate = WEDDING_DATE_ISO) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day));
  return {
    weekday: new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      timeZone: "UTC",
    }).format(date),
    rest: formatLongDate(isoDate),
  };
}

export function formatStamp(value: Date, timeZone = DEFAULT_TIMEZONE) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(value);
}

export function toDateTimeLocal(value: Date, timeZone = DEFAULT_TIMEZONE) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(value);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  let hour = read("hour");
  if (hour === "24") hour = "00";
  return `${read("year")}-${read("month")}-${read("day")}T${hour}:${read("minute")}`;
}

export function parseClock(label: string | null | undefined) {
  if (!label) return null;
  const match = label.trim().match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3]?.toUpperCase();
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }
  return { hours, minutes };
}

export function zonedIso(date: string, hours: number, minutes: number, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const utcGuess = new Date(Date.UTC(year, (month ?? 1) - 1, day, hours, minutes, 0));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(utcGuess);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  let hour = read("hour");
  let dayPart = read("day");
  let monthPart = read("month");
  let yearPart = read("year");
  if (hour === 24) {
    hour = 0;
    const rolled = new Date(Date.UTC(yearPart, monthPart - 1, dayPart + 1));
    yearPart = rolled.getUTCFullYear();
    monthPart = rolled.getUTCMonth() + 1;
    dayPart = rolled.getUTCDate();
  }
  const asUtc = Date.UTC(yearPart, monthPart - 1, dayPart, hour, read("minute"), read("second"));
  const offset = asUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offset).toISOString();
}

export function eventMoment(date: string | null, timeLabel: string | null, timeZone: string) {
  if (!date) return null;
  const clock = parseClock(timeLabel) ?? { hours: 0, minutes: 0 };
  return zonedIso(date, clock.hours, clock.minutes, timeZone);
}

export function parseZonedDateTime(value: string, timeZone: string) {
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  return new Date(zonedIso(match[1], Number(match[2]), Number(match[3]), timeZone));
}

export function earliestMoment(
  events: { date: string | null; timeLabel: string | null }[],
  timeZone: string,
) {
  const moments = events
    .map((event) => eventMoment(event.date, event.timeLabel, timeZone))
    .filter((value): value is string => Boolean(value))
    .sort();
  return moments[0] ?? eventMoment(WEDDING_DATE_ISO, "1:00 PM", timeZone);
}

export function dateOnly(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day));
}

export function emptyToNull(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

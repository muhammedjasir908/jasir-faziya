"use client";

import { useState } from "react";

export function CalendarButton({
  summary = "Wedding Reception: Muhammed Jasir & Faziya Sherin",
  description = "With the blessings of Allah, celebrating the wedding of Muhammed Jasir & Faziya Sherin. Reception from 1:00 PM until 3:00 PM at Shadhi Mahal Auditorium.",
  location = "Shadhi Mahal Auditorium, Vadakara, Kozhikode",
  startUtc = "20261207T073000Z",
  endUtc = "20261207T093000Z",
  uid = "jasir-faziya-wedding-20261207@wedding",
  filename = "jasir-faziya-wedding.ics",
}: {
  summary?: string;
  description?: string;
  location?: string;
  startUtc?: string;
  endUtc?: string;
  uid?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(summary)}&dates=${startUtc}/${endUtc}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  function downloadIcs() {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jasir and Faziya Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      "DTSTAMP:20261110T000000Z",
      `DTSTART:${startUtc}`,
      `DTEND:${endUtc}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function copyAddress() {
    navigator.clipboard?.writeText(location);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-gold text-xs"
      >
        <CalendarIcon />
        Add to Google Calendar
      </a>

      <button
        type="button"
        onClick={downloadIcs}
        className="btn btn-light text-xs"
      >
        <DownloadIcon />
        Save to iCal / Outlook
      </button>

      <button
        type="button"
        onClick={copyAddress}
        className="btn btn-light text-xs"
      >
        <CopyIcon />
        {copied ? "Address Copied!" : "Copy Address"}
      </button>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

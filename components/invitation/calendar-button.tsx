"use client";

import { useState } from "react";

export function CalendarButton() {
  const [copied, setCopied] = useState(false);

  // Event: 7 Dec 2026, 1:00 PM - 3:00 PM IST (UTC+5:30 => 07:30 - 09:30 UTC)
  const title = encodeURIComponent("Wedding Reception: Muhammed Jasir & Faziya Sherin");
  const details = encodeURIComponent(
    "With the blessings of Allah, celebrating the wedding of Muhammed Jasir & Faziya Sherin. Reception from 1:00 PM until 3:00 PM at Shadhi Mahal Auditorium."
  );
  const location = encodeURIComponent("Shadhi Mahal Auditorium, Vadakara, Kozhikode");
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261207T073000Z/20261207T093000Z&details=${details}&location=${location}`;

  function downloadIcs() {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jasir and Faziya Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:jasir-faziya-wedding-20261207@wedding",
      "DTSTAMP:20261110T000000Z",
      "DTSTART:20261207T073000Z",
      "DTEND:20261207T093000Z",
      "SUMMARY:Wedding Reception: Muhammed Jasir & Faziya Sherin",
      "DESCRIPTION:With the blessings of Allah, celebrating the wedding of Muhammed Jasir & Faziya Sherin.",
      "LOCATION:Shadhi Mahal Auditorium, Vadakara, Kozhikode",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "jasir-faziya-wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function copyAddress() {
    navigator.clipboard?.writeText("Shadhi Mahal Auditorium, Vadakara, Kozhikode, Kerala");
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

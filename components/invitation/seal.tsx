import type { ReactNode } from "react";

import { BISMILLAH, BISMILLAH_ENGLISH, BRIDE, GROOM } from "@/lib/constants";

export function Rose({ tone, className = "" }: { tone: "red" | "white"; className?: string }) {
  const petal = tone === "red" ? "#8E2438" : "#F7F1E8";
  const shade = tone === "red" ? "#5C1424" : "#E7D5C8";
  return (
    <svg viewBox="0 0 80 110" className={className} aria-hidden>
      <path d="M40 108 C40 86 40 72 40 58" fill="none" stroke="#2C5A3A" strokeWidth="1.6" />
      <ellipse cx="28" cy="78" rx="11" ry="5" fill="#2C5A3A" transform="rotate(-35 28 78)" />
      <ellipse cx="54" cy="70" rx="11" ry="5" fill="#3E6B48" transform="rotate(32 54 70)" />
      <ellipse cx="40" cy="34" rx="10" ry="14" fill={petal} stroke={shade} />
      <ellipse cx="28" cy="38" rx="10" ry="13" fill={petal} stroke={shade} transform="rotate(-28 28 38)" />
      <ellipse cx="52" cy="38" rx="10" ry="13" fill={petal} stroke={shade} transform="rotate(28 52 38)" />
      <ellipse cx="32" cy="26" rx="8" ry="11" fill={petal} stroke={shade} transform="rotate(-12 32 26)" />
      <ellipse cx="48" cy="26" rx="8" ry="11" fill={petal} stroke={shade} transform="rotate(12 48 26)" />
      <circle cx="40" cy="30" r="5" fill={shade} />
    </svg>
  );
}

export function Monogram() {
  return (
    <div className="monogram" aria-hidden>
      <div>
        <p className="text-[0.52rem] uppercase tracking-[0.28em] text-[#e4c98a]">The matrimonial</p>
        <p className="mt-1 font-script text-4xl leading-none text-[#f6e7c4]">J &amp; F</p>
        <p className="mt-1 text-[0.52rem] uppercase tracking-[0.18em] text-[#e4c98a]">Jasir &amp; Faziya</p>
      </div>
    </div>
  );
}

export function SealBlock({ action }: { action?: ReactNode }) {
  return (
    <div className="relative text-center">
      <div className="mb-4 flex items-end justify-center gap-2">
        <Rose tone="white" className="rose h-20 w-16" />
        <div>
          <p lang="ar" dir="rtl" className="font-arabic text-xl leading-relaxed text-[#f3e2bc] md:text-2xl">
            {BISMILLAH}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-[0.62rem] uppercase leading-5 tracking-[0.22em] text-[#e4c98a]">
            {BISMILLAH_ENGLISH}
          </p>
        </div>
        <Rose tone="red" className="rose rose-right h-20 w-16" />
      </div>
      <Monogram />
      <p className="section-kicker mt-5">The matrimonial suite</p>
      <p className="mt-2 font-script text-2xl text-[#f6e7c4]">
        {GROOM} <span className="text-[#e4c98a]">&</span> {BRIDE}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

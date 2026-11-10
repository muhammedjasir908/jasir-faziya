"use client";

import { useId } from "react";

interface RoseBouquetProps {
  side?: "left" | "right";
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

/**
 * An artistic, royal wedding rose bouquet illustration featuring:
 * - Deep velvet crimson garden rose
 * - Delicate champagne / ivory rose
 * - Velvet rose bud
 * - Emerald & sage eucalyptus foliage with gold vein accents
 * - Golden berry sprigs & jasmine star blossoms
 * - Silk gold ribbon ties
 */
export function RoseBouquet({
  side = "left",
  className = "",
  size = "md",
  animated = true,
}: RoseBouquetProps) {
  const id = useId().replace(/:/g, "_");
  const isRight = side === "right";

  const sizeClasses = {
    sm: "w-16 h-28 sm:w-20 sm:h-36",
    md: "w-20 h-36 sm:w-28 sm:h-48 md:w-32 md:h-56",
    lg: "w-24 h-44 sm:w-36 sm:h-60 md:w-40 md:h-68",
  }[size];

  const animationClass = animated
    ? isRight
      ? "animate-bouquet-sway-right"
      : "animate-bouquet-sway-left"
    : "";

  return (
    <div
      className={`pointer-events-none select-none transition-transform duration-700 ${animationClass} ${className}`}
      aria-hidden="true"
      style={{
        transformOrigin: isRight ? "bottom left" : "bottom right",
      }}
    >
      <svg
        viewBox="0 0 160 260"
        className={`${sizeClasses} ${isRight ? "-scale-x-100" : ""} drop-shadow-[0_8px_16px_rgba(20,4,8,0.35)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Crimson Velvet Gradient */}
          <radialGradient
            id={`rose-crimson-${id}`}
            cx="45%"
            cy="40%"
            r="60%"
            fx="40%"
            fy="35%"
          >
            <stop offset="0%" stopColor="#d83a56" />
            <stop offset="35%" stopColor="#a81c36" />
            <stop offset="75%" stopColor="#6e0c20" />
            <stop offset="100%" stopColor="#3d0510" />
          </radialGradient>

          {/* Crimson Rose Petal Highlight */}
          <linearGradient id={`rose-petal-hi-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f46882" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a81c36" stopOpacity="0.2" />
          </linearGradient>

          {/* Champagne Ivory Gradient */}
          <radialGradient
            id={`rose-champagne-${id}`}
            cx="48%"
            cy="45%"
            r="55%"
            fx="45%"
            fy="40%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fff8ed" />
            <stop offset="70%" stopColor="#faecd6" />
            <stop offset="100%" stopColor="#deb892" />
          </radialGradient>

          {/* Leaf Gradients */}
          <linearGradient id={`leaf-deep-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f7f5a" />
            <stop offset="60%" stopColor="#2c5438" />
            <stop offset="100%" stopColor="#15321f" />
          </linearGradient>

          <linearGradient id={`leaf-sage-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ba184" />
            <stop offset="70%" stopColor="#4a6f52" />
            <stop offset="100%" stopColor="#253e2c" />
          </linearGradient>

          {/* Gold Gradient for vines & berries */}
          <linearGradient id={`gold-shine-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcedc7" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="85%" stopColor="#9a741c" />
            <stop offset="100%" stopColor="#5d440d" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id={`petal-shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#220409" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ================= BACKGROUND STEMS & FOLIAGE ================= */}
        <g id="stems-and-branches" strokeLinecap="round">
          {/* Main stem curving down */}
          <path
            d="M 82 140 Q 75 190 70 248"
            stroke="#213d29"
            strokeWidth="3.2"
          />
          <path
            d="M 82 140 Q 92 195 98 245"
            stroke="#2e5437"
            strokeWidth="2.4"
          />
          {/* Curving branch to upper left */}
          <path
            d="M 80 125 Q 45 95 32 40"
            stroke={`url(#gold-shine-${id})`}
            strokeWidth="1.6"
            strokeDasharray="1 0"
          />
          {/* Branch to upper right */}
          <path
            d="M 88 120 Q 120 85 130 35"
            stroke="#3a6345"
            strokeWidth="1.8"
          />
        </g>

        {/* ================= GOLDEN ACCENT SPRIGS & BERRIES ================= */}
        <g id="gold-accents">
          {/* Golden eucalyptus branch */}
          <path
            d="M 45 80 Q 25 50 18 20"
            stroke={`url(#gold-shine-${id})`}
            strokeWidth="1.4"
          />
          {/* Golden berries */}
          <circle cx="18" cy="20" r="3.5" fill={`url(#gold-shine-${id})`} />
          <circle cx="28" cy="40" r="3" fill={`url(#gold-shine-${id})`} />
          <circle cx="38" cy="62" r="3.2" fill={`url(#gold-shine-${id})`} />
          <circle cx="22" cy="55" r="2.4" fill={`url(#gold-shine-${id})`} />
          <circle cx="12" cy="35" r="2.2" fill={`url(#gold-shine-${id})`} />

          {/* Right gold sprig */}
          <path
            d="M 105 100 Q 135 75 145 42"
            stroke={`url(#gold-shine-${id})`}
            strokeWidth="1.3"
          />
          <circle cx="145" cy="42" r="3.2" fill={`url(#gold-shine-${id})`} />
          <circle cx="132" cy="60" r="2.8" fill={`url(#gold-shine-${id})`} />
          <circle cx="120" cy="78" r="3" fill={`url(#gold-shine-${id})`} />
          <circle cx="140" cy="72" r="2.2" fill={`url(#gold-shine-${id})`} />

          {/* Little Jasmine blossoms */}
          <g transform="translate(35, 30)">
            <path
              d="M 0 -7 C 2 -3 4 -1 7 0 C 4 1 2 3 0 7 C -2 3 -4 1 -7 0 C -4 -1 -2 -3 0 -7 Z"
              fill="#fffdf8"
              stroke="#e4c98a"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1.3" fill="#d4af37" />
          </g>
          <g transform="translate(136, 92)">
            <path
              d="M 0 -6 C 2 -2 3 -1 6 0 C 3 1 2 2 0 6 C -2 2 -3 1 -6 0 C -3 -1 -2 -2 0 -6 Z"
              fill="#fffdf8"
              stroke="#e4c98a"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1.2" fill="#d4af37" />
          </g>
        </g>

        {/* ================= LEAVES & BOTANICALS ================= */}
        <g id="eucalyptus-leaves">
          {/* Top-left deep leaf */}
          <g transform="rotate(-30 42 65)">
            <path
              d="M 42 65 C 25 45 28 20 45 10 C 60 22 55 50 42 65 Z"
              fill={`url(#leaf-deep-${id})`}
              stroke="#1b3923"
              strokeWidth="0.6"
            />
            <path d="M 42 65 C 44 48 45 28 45 10" stroke="#75a580" strokeWidth="0.6" opacity="0.6" />
          </g>

          {/* Top-right sage leaf */}
          <g transform="rotate(28 118 70)">
            <path
              d="M 118 70 C 135 50 132 25 115 15 C 100 28 105 55 118 70 Z"
              fill={`url(#leaf-sage-${id})`}
              stroke="#1b3923"
              strokeWidth="0.6"
            />
            <path d="M 118 70 C 116 52 115 32 115 15" stroke="#a4caa9" strokeWidth="0.6" opacity="0.6" />
          </g>

          {/* Outer far-left drooping leaf */}
          <path
            d="M 50 115 C 20 108 5 125 0 148 C 15 152 42 142 50 115 Z"
            fill={`url(#leaf-deep-${id})`}
            stroke="#16301d"
            strokeWidth="0.6"
          />
          <path d="M 50 115 C 32 125 18 136 0 148" stroke="#7ba184" strokeWidth="0.6" opacity="0.5" />

          {/* Far-right leaf */}
          <path
            d="M 115 130 C 145 125 160 142 158 165 C 142 168 122 155 115 130 Z"
            fill={`url(#leaf-sage-${id})`}
            stroke="#1b3923"
            strokeWidth="0.6"
          />
          <path d="M 115 130 C 130 142 145 152 158 165" stroke="#9bc1a1" strokeWidth="0.6" opacity="0.5" />

          {/* Lower leaf cluster */}
          <path
            d="M 72 175 C 50 188 38 215 45 230 C 62 225 72 205 72 175 Z"
            fill={`url(#leaf-deep-${id})`}
            stroke="#16301d"
            strokeWidth="0.6"
          />
          <path
            d="M 96 172 C 118 185 128 210 120 225 C 104 220 95 200 96 172 Z"
            fill={`url(#leaf-sage-${id})`}
            stroke="#1b3923"
            strokeWidth="0.6"
          />
        </g>

        {/* ================= ROSE BUD (UPPER CENTER-RIGHT) ================= */}
        <g id="rose-bud" transform="translate(100, 52) rotate(16)">
          {/* Calyx sepals */}
          <path d="M 0 28 C -5 18 -12 8 -8 0 C -4 10 0 18 2 28 Z" fill="#2c5438" />
          <path d="M 6 28 C 12 18 18 8 15 0 C 10 10 6 18 4 28 Z" fill="#3a6345" />
          <path d="M 3 32 L 3 45" stroke="#2c5438" strokeWidth="2" />
          {/* Crimson bud petals */}
          <path
            d="M -2 24 C -8 15 -6 4 3 2 C 12 4 14 15 8 24 Z"
            fill={`url(#rose-crimson-${id})`}
            stroke="#460914"
            strokeWidth="0.6"
          />
          <path
            d="M 1 24 C -2 16 0 8 4 6 C 7 8 8 16 5 24 Z"
            fill="#d83a56"
            opacity="0.85"
          />
        </g>

        {/* ================= CHAMPAGNE / IVORY ROSE (LEFT-CENTER) ================= */}
        <g
          id="champagne-rose"
          transform="translate(48, 122) rotate(-10)"
          filter={`url(#petal-shadow-${id})`}
        >
          {/* Outermost petals */}
          <path
            d="M -22 6 C -28 -12 -8 -26 8 -24 C 24 -22 34 -6 28 12 C 20 28 -12 24 -22 6 Z"
            fill={`url(#rose-champagne-${id})`}
            stroke="#deb892"
            strokeWidth="0.6"
          />
          {/* Mid outer petal left */}
          <path
            d="M -20 -2 C -24 -18 -8 -26 4 -22 C -4 -16 -12 -4 -20 -2 Z"
            fill="#faecd6"
            stroke="#c8a682"
            strokeWidth="0.5"
          />
          {/* Mid outer petal right */}
          <path
            d="M 22 2 C 28 -10 16 -24 0 -22 C 12 -16 18 -2 22 2 Z"
            fill="#faecd6"
            stroke="#c8a682"
            strokeWidth="0.5"
          />
          {/* Inner cupped petal bottom */}
          <path
            d="M -16 8 C -10 20 12 20 18 8 C 8 14 -8 14 -16 8 Z"
            fill="#f5e2c8"
            stroke="#c8a682"
            strokeWidth="0.5"
          />
          {/* Rose heart spiral */}
          <path
            d="M -10 -6 C -12 -14 0 -18 8 -14 C 14 -10 12 0 4 4 C -4 8 -8 2 -10 -6 Z"
            fill="#ffffff"
            stroke="#d4af37"
            strokeWidth="0.6"
          />
          <path
            d="M -4 -8 C -2 -12 4 -12 6 -8 C 8 -4 4 0 0 0 C -4 0 -5 -4 -4 -8 Z"
            fill="#f7dfb9"
            stroke="#b89028"
            strokeWidth="0.5"
          />
          <circle cx="1" cy="-5" r="2.2" fill="#d4af37" opacity="0.8" />
        </g>

        {/* ================= VELVET CRIMSON MAIN ROSE (CENTER-RIGHT) ================= */}
        <g
          id="crimson-main-rose"
          transform="translate(94, 118) rotate(12)"
          filter={`url(#petal-shadow-${id})`}
        >
          {/* Outer large petals */}
          <path
            d="M -34 10 C -42 -14 -16 -38 12 -34 C 40 -30 52 -4 42 22 C 30 46 -18 42 -34 10 Z"
            fill={`url(#rose-crimson-${id})`}
            stroke="#4a0815"
            strokeWidth="0.8"
          />
          {/* Outer petal flare top-left */}
          <path
            d="M -28 -10 C -36 -28 -12 -38 6 -32 C -6 -24 -18 -10 -28 -10 Z"
            fill="#b8233f"
            stroke="#5f0c1d"
            strokeWidth="0.6"
          />
          {/* Outer petal flare top-right */}
          <path
            d="M 32 4 C 42 -14 24 -36 0 -32 C 18 -24 28 -6 32 4 Z"
            fill="#c42b47"
            stroke="#5f0c1d"
            strokeWidth="0.6"
          />
          {/* Outer petal lower bowl */}
          <path
            d="M -24 16 C -14 36 20 38 30 16 C 14 26 -10 26 -24 16 Z"
            fill="#96172e"
            stroke="#4a0815"
            strokeWidth="0.6"
          />
          {/* Middle petal ring */}
          <path
            d="M -18 -4 C -24 -20 -2 -28 14 -22 C 28 -16 28 6 16 16 C 0 24 -12 14 -18 -4 Z"
            fill={`url(#rose-crimson-${id})`}
            stroke="#3d0510"
            strokeWidth="0.6"
          />
          {/* Inner petal highlights */}
          <path
            d="M -14 -8 C -18 -18 0 -22 10 -16 C 0 -14 -10 -6 -14 -8 Z"
            fill="#df3d5b"
            opacity="0.9"
          />
          <path
            d="M 12 -6 C 18 -16 4 -22 -4 -18 C 6 -14 12 -4 12 -6 Z"
            fill="#ea4f6d"
            opacity="0.85"
          />
          <path
            d="M -12 6 C -4 16 14 14 16 4 C 8 10 -6 10 -12 6 Z"
            fill="#c02643"
          />
          {/* Rose center core bud */}
          <path
            d="M -6 -8 C -8 -14 0 -16 6 -12 C 10 -8 8 0 2 2 C -4 4 -6 -2 -6 -8 Z"
            fill="#801024"
            stroke="#4a0815"
            strokeWidth="0.6"
          />
          <path
            d="M -2 -9 C 0 -12 4 -12 5 -9 C 6 -6 3 -3 1 -4 C -1 -5 -2 -7 -2 -9 Z"
            fill="#d83a56"
          />
          {/* Velvet sheen glint */}
          <circle cx="-5" cy="-14" r="1.5" fill="#ffffff" opacity="0.4" />
        </g>

        {/* ================= GOLD RIBBON TIE ================= */}
        <g id="gold-ribbon" transform="translate(82, 172)">
          {/* Left ribbon loop */}
          <path
            d="M 0 0 C -12 -12 -28 -6 -24 6 C -20 14 -6 6 0 0 Z"
            fill={`url(#gold-shine-${id})`}
            stroke="#7d5912"
            strokeWidth="0.6"
          />
          {/* Right ribbon loop */}
          <path
            d="M 0 0 C 14 -12 28 -6 24 6 C 20 14 6 6 0 0 Z"
            fill={`url(#gold-shine-${id})`}
            stroke="#7d5912"
            strokeWidth="0.6"
          />
          {/* Knot */}
          <circle cx="0" cy="1" r="4.2" fill={`url(#gold-shine-${id})`} stroke="#614207" strokeWidth="0.7" />
          {/* Left ribbon tail */}
          <path
            d="M -2 4 Q -16 28 -20 54 Q -15 50 -10 52 Q -10 26 0 4 Z"
            fill={`url(#gold-shine-${id})`}
            opacity="0.9"
          />
          {/* Right ribbon tail */}
          <path
            d="M 2 4 Q 14 30 18 56 Q 13 52 8 54 Q 7 28 0 4 Z"
            fill={`url(#gold-shine-${id})`}
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Side ornament bouquet designed to flank invitation cards.
 * Can be positioned on the left side, right side, or both sides!
 */
export function CardSideBouquets({
  variant = "both",
  className = "",
  size = "md",
}: {
  variant?: "both" | "left" | "right";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const showLeft = variant === "both" || variant === "left";
  const showRight = variant === "both" || variant === "right";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 overflow-visible ${className}`}
      aria-hidden="true"
    >
      {showLeft ? (
        <div className="absolute -left-6 sm:-left-12 md:-left-16 top-1/2 -translate-y-1/2">
          <RoseBouquet side="left" size={size} />
        </div>
      ) : null}

      {showRight ? (
        <div className="absolute -right-6 sm:-right-12 md:-right-16 top-1/2 -translate-y-1/2">
          <RoseBouquet side="right" size={size} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Corner Bouquet accent for cards (e.g. top-left or top-right crest).
 */
export function CardCornerBouquet({
  position = "top-left",
  size = "sm",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md";
  className?: string;
}) {
  const isRight = position.includes("right");
  const isBottom = position.includes("bottom");

  const posClass = {
    "top-left": "-left-5 sm:-left-9 -top-8 sm:-top-12",
    "top-right": "-right-5 sm:-right-9 -top-8 sm:-top-12",
    "bottom-left": "-left-5 sm:-left-9 -bottom-8 sm:-bottom-12",
    "bottom-right": "-right-5 sm:-right-9 -bottom-8 sm:-bottom-12",
  }[position];

  return (
    <div
      className={`pointer-events-none absolute z-20 overflow-visible ${posClass} ${className}`}
      aria-hidden="true"
    >
      <div className={isBottom ? "rotate-180" : ""}>
        <RoseBouquet side={isRight ? "right" : "left"} size={size} />
      </div>
    </div>
  );
}

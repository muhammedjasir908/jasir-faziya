"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  type: "star" | "dot" | "glint";
}

export function SparkleField() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const items: Sparkle[] = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${(i * 4.3 + Math.random() * 6) % 96}%`,
        top: `${Math.random() * 100}%`,
        size: 5 + Math.round(Math.random() * 8),
        delay: `${(Math.random() * 6).toFixed(1)}s`,
        duration: `${3.5 + Math.random() * 4}s`,
        type: i % 3 === 0 ? "star" : i % 3 === 1 ? "glint" : "dot",
      }));
      setSparkles(items);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-particle absolute text-[#fcedc7]"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          {s.type === "star" ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full opacity-85">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          ) : s.type === "glint" ? (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-full w-full opacity-75">
              <circle cx="10" cy="10" r="3" />
              <path d="M10 2L10 18M2 10L18 10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          ) : (
            <span className="block h-full w-full rounded-full bg-[#fce8b8] shadow-[0_0_8px_#fcedc7] opacity-80" />
          )}
        </span>
      ))}
    </div>
  );
}

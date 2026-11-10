"use client";

import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: string;
  delay: string;
  dur: string;
  sway: string;
  spin: string;
  size: number;
  tone: "white" | "red";
};

function RosePetal({ tone }: { tone: "white" | "red" }) {
  const fill = tone === "red" ? "#C83A52" : "#FFFDF8";
  const vein = tone === "red" ? "#7A1C30" : "#E7D0BE";
  return (
    <svg viewBox="0 0 32 46" className="h-full w-full" aria-hidden>
      <path
        d="M16 2C23 11 30 20 26 33C22 42 10 42 6 33C2 20 9 11 16 2Z"
        fill={fill}
        stroke={vein}
        strokeWidth="0.6"
      />
      <path d="M16 8C16 20 16 32 16 42" fill="none" stroke={vein} strokeWidth="0.45" opacity="0.75" />
    </svg>
  );
}

export function PetalField() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPetals(
        Array.from({ length: 36 }, (_, index) => ({
          id: index,
          left: `${Math.random() * 100}%`,
          delay: `${-Math.random() * 16}s`,
          dur: `${11 + Math.random() * 9}s`,
          sway: `${Math.round(Math.random() * 90 - 45)}px`,
          spin: `${Math.round(180 + Math.random() * 540)}deg`,
          size: 14 + Math.round(Math.random() * 16),
          tone: Math.random() > 0.42 ? "red" : "white",
        })),
      );
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div aria-hidden>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal-float"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.35,
            animationDelay: petal.delay,
            animationDuration: petal.dur,
            ["--sway" as string]: petal.sway,
            ["--spin" as string]: petal.spin,
          }}
        >
          <RosePetal tone={petal.tone} />
        </span>
      ))}
    </div>
  );
}

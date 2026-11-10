"use client";

import { useEffect, useState, type ReactNode } from "react";

import { BISMILLAH, BRIDE, GROOM } from "@/lib/constants";
import { RoseBouquet } from "@/components/invitation/roses-bouquet";

function Envelope({ open }: { open: boolean }) {
  return (
    <div className={`envelope-scene ${open ? "is-open" : ""}`} aria-hidden>
      <div className="envelope">
        <div className="env-pocket" />
        <div className="env-letter" />
        <div className="env-flap" />
        <div className="env-seal">
          <span>J&amp;F</span>
        </div>
      </div>
    </div>
  );
}

export function Opening({ children, guestName }: { children: ReactNode; guestName?: string }) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "leaving" | "done">("sealed");
  const [lock, setLock] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(skip);
    }
    document.body.style.overflow = "hidden";
    const lockTimer = window.setTimeout(() => setLock(true), 0);
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-unsealing");
      window.clearTimeout(lockTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-unsealing");
    }
  }, [phase]);

  function unseal() {
    if (phase !== "sealed") return;
    setPhase("opening");
    document.body.dataset.unsealing = "1";
    window.setTimeout(() => setPhase("leaving"), 1100);
    window.setTimeout(() => setPhase("done"), 2000);
  }

  return (
    <>
      <noscript>
        <style>{`.veil{display:none !important}`}</style>
      </noscript>
      <div inert={lock && phase !== "done"}>{children}</div>
      {phase !== "done" ? (
        <div className={`veil safe-x ${phase === "leaving" ? "veil-leave" : ""}`}>
          <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-8 text-center">
            <p lang="ar" dir="rtl" className="arrive font-arabic text-2xl text-[#f3e2bc]">
              {BISMILLAH}
            </p>
            <p className="arrive arrive-2 section-kicker mt-4">A letter sealed for you</p>
            <div className="arrive arrive-3 relative mt-8 flex items-center justify-center">
              <div className="pointer-events-none absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2">
                <RoseBouquet side="left" size="sm" />
              </div>
              <Envelope open={phase !== "sealed"} />
              <div className="pointer-events-none absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2">
                <RoseBouquet side="right" size="sm" />
              </div>
            </div>
            <p className="arrive arrive-4 mt-1 font-script text-4xl leading-none text-[#f6e7c4]">
              {GROOM}
            </p>
            <p className="arrive arrive-4 font-script text-3xl leading-none text-[#e4c98a]">&</p>
            <p className="arrive arrive-4 font-script text-4xl leading-none text-[#f6e7c4]">{BRIDE}</p>
            {guestName ? (
              <p className="arrive arrive-5 mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-[#e4c98a]">
                Joyfully requesting the presence of
                <span className="mt-2 block font-display text-2xl normal-case tracking-normal text-[#fbf6ef]">
                  {guestName}
                </span>
              </p>
            ) : (
              <p className="arrive arrive-5 mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-[#e4c98a]">
                With the blessings of Allah
              </p>
            )}
            <button type="button" className="scroll-cue unseal arrive arrive-6 mt-8" onClick={unseal}>
              Unseal invitation
            </button>
            <p className="arrive arrive-6 mt-4 text-[0.62rem] uppercase tracking-[0.28em] text-[#f3e2bc]/80">
              Tap, and the roses will rise
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ScrollCue({ target, label }: { target: string; label: string }) {
  return (
    <button
      type="button"
      className="scroll-cue"
      onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })}
    >
      {label}
    </button>
  );
}

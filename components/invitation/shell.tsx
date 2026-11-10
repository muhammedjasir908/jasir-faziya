import type { ReactNode } from "react";

import { PatternField } from "@/components/invitation/ornaments";
import { PetalField } from "@/components/invitation/petals";
import { SparkleField } from "@/components/invitation/sparkles";

export function PublicShell({ children, tone = "velvet" }: { children: ReactNode; tone?: "velvet" | "garden" }) {
  return (
    <div className={tone === "garden" ? "invitation-garden relative min-h-dvh overflow-x-hidden" : "invitation-bg on-velvet relative min-h-dvh overflow-x-hidden"}>
      <PatternField />
      <SparkleField />
      <PetalField tone={tone === "garden" ? "white" : "mixed"} />
      <a className="skip-link" href="#content">
        Skip to invitation
      </a>
      <div id="content" className="safe-x relative z-10">
        {children}
      </div>
    </div>
  );
}

export function InvitationFallback() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <p className="font-display text-3xl text-[#fbf6ef]">Opening your invitation</p>
    </div>
  );
}

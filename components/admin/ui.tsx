import type { ReactNode } from "react";

import type { InvitationAccess, InvitationState } from "@/lib/public-types";

export function PageHeader({
  title,
  lede,
  action,
}: {
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="section-kicker">Family desk</p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{title}</h1>
        {lede ? <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{lede}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "sage" | "gold" | "ink" | "clay";
  children: ReactNode;
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: InvitationState }) {
  if (status === "ACTIVE") return <Badge tone="sage">Active</Badge>;
  if (status === "DISABLED") return <Badge tone="ink">Disabled</Badge>;
  return <Badge tone="gold">Expired</Badge>;
}

export function ReplyBadge({ response }: { response: "ACCEPTED" | "DECLINED" | "PENDING" }) {
  if (response === "ACCEPTED") return <Badge tone="sage">Accepted</Badge>;
  if (response === "DECLINED") return <Badge tone="clay">Declined</Badge>;
  return <Badge tone="gold">Pending</Badge>;
}

export function categoryLabel(type: InvitationAccess) {
  return type === "BOTH_EVENTS" ? "Both events" : "Reception only";
}

export function DatabaseNotice() {
  return (
    <p className="note">
      The family desk cannot reach the database yet. Copy <span className="font-medium">.env.example</span> to{" "}
      <span className="font-medium">.env</span>, start Postgres, then run <span className="font-medium">npm run db:setup</span>.
    </p>
  );
}

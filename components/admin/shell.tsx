"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/rsvps", label: "Replies" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-xs uppercase tracking-[0.16em] ${active ? "bg-white/15 text-white" : "text-champagne hover:bg-white/10"}`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-light"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}

export function AdminShell({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-ivory text-ink">
      <div className="bg-sage-deep text-ivory md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <p className="font-display text-3xl">J &amp; F</p>
          <LogoutButton />
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-4" aria-label="Family desk">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sage-deep px-5 py-8 text-ivory md:flex">
        <p className="font-script text-4xl text-champagne">J &amp; F</p>
        <p className="mt-2 text-sm text-champagne/80">{name}</p>
        <nav className="mt-10 flex flex-col gap-1" aria-label="Family desk">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
      <div className="px-4 py-6 md:ml-64 md:px-8 md:py-8">{children}</div>
    </div>
  );
}

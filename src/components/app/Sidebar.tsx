"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Plus,
  Car,
  Ticket,
  MessageCircle,
  User,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

const items = [
  { href: "/app", label: "Dashboard", icon: Car, kbd: "G D" },
  { href: "/app/search", label: "Find a ride", icon: Search, kbd: "G F" },
  { href: "/app/publish", label: "Publish ride", icon: Plus, kbd: "G P" },
  { href: "/app/bookings", label: "My bookings", icon: Ticket, kbd: "G B" },
  { href: "/app/inbox", label: "Inbox", icon: MessageCircle, kbd: "G I", badge: 3 },
  { href: "/app/profile", label: "Profile", icon: User, kbd: "G U" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-line bg-paper/60">
      <div className="border-b border-line/60 p-6">
        <Link href="/" className="block">
          <Logo />
        </Link>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
          v1.0.1 · Web (beta)
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {items.map((it) => {
          const active =
            it.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-ink text-cream"
                  : "text-ink-soft hover:bg-cream-soft hover:text-ink"
              )}
            >
              <it.icon className="size-4" strokeWidth={1.75} />
              <span className="flex-1 font-medium">{it.label}</span>
              {it.badge && (
                <span
                  className={cn(
                    "min-w-[20px] rounded-full px-1.5 text-center font-mono text-[10px] font-semibold",
                    active ? "bg-lime text-ink" : "bg-coral text-cream"
                  )}
                >
                  {it.badge}
                </span>
              )}
              <kbd
                className={cn(
                  "hidden font-mono text-[10px] tracking-wide opacity-50 group-hover:inline-block",
                  active ? "text-cream" : "text-ink-muted"
                )}
              >
                {it.kbd}
              </kbd>
            </Link>
          );
        })}
      </nav>

      {/* Live ride card pinned at bottom */}
      <div className="border-t border-line/60 p-4">
        <Link
          href="/app/active"
          className="block overflow-hidden rounded-2xl border border-ink/10 bg-lime"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/70">
                · Live ride
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-ink/70">
                <span className="size-1.5 animate-pulse rounded-full bg-coral" />
                In progress
              </span>
            </div>
            <div className="mt-2 font-display text-lg font-semibold leading-tight">
              Bengaluru → Mysuru
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/15">
              <div className="h-full w-[42%] bg-ink" />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">
              <span>Eta 2h 14m</span>
              <span>3 / 4 picked up</span>
            </div>
          </div>
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <div
            className="grid size-9 place-items-center rounded-full font-display text-sm font-semibold text-ink"
            style={{ background: "hsl(88 60% 75%)" }}
          >
            G
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">Gagan Karthik</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              ★ 4.85 · 17 trips
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

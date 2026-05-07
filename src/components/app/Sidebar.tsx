"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Car,
  Ticket,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth-context";
import { useMyChats, useMyProfile } from "@/lib/queries";

const items = [
  { href: "/app", label: "Dashboard", icon: Car, kbd: "G D" },
  { href: "/app/search", label: "Find a ride", icon: Search, kbd: "G F" },
  { href: "/app/publish", label: "Publish ride", icon: Plus, kbd: "G P" },
  { href: "/app/bookings", label: "My bookings", icon: Ticket, kbd: "G B" },
  { href: "/app/inbox", label: "Inbox", icon: MessageCircle, kbd: "G I" },
  { href: "/app/profile", label: "Profile", icon: User, kbd: "G U" },
];

function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useMyProfile();
  const { chats } = useMyChats();

  const inboxUnread = user
    ? chats.reduce((acc, c) => acc + (c.unread?.[user.uid] ?? 0), 0)
    : 0;

  const initial =
    (profile?.name || user?.displayName || user?.phoneNumber || "?")
      .replace(/^\+/, "")
      .charAt(0)
      .toUpperCase();

  const hue = user ? hueFromId(user.uid) : 88;

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

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
          const badge = it.href === "/app/inbox" ? inboxUnread : 0;
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
              {badge > 0 && (
                <span
                  className={cn(
                    "min-w-[20px] rounded-full px-1.5 text-center font-mono text-[10px] font-semibold",
                    active ? "bg-lime text-ink" : "bg-coral text-cream"
                  )}
                >
                  {badge > 99 ? "99+" : badge}
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

      <div className="border-t border-line/60 p-4">
        <div className="flex items-center gap-3">
          <div
            className="grid size-9 place-items-center overflow-hidden rounded-full font-display text-sm font-semibold text-ink"
            style={{ background: `hsl(${hue} 60% 75%)` }}
          >
            {profile?.profilePhoto || user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile?.profilePhoto || user?.photoURL || ""}
                alt={profile?.name || "You"}
                className="size-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {profile?.name || user?.displayName || "You"}
            </div>
            <div className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              {profile?.ratingCount && profile.ratingCount > 0
                ? `★ ${(profile.rating ?? 0).toFixed(2)} · ${profile.ratingCount} reviews`
                : "New rider"}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="grid size-8 place-items-center rounded-full border border-line text-ink-muted transition hover:border-ink hover:text-ink"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}

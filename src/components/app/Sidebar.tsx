"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-close the mobile drawer on route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

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

  const navContent = (
    <>
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
                  "hidden font-mono text-[10px] tracking-wide opacity-50 lg:group-hover:inline-block",
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
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger — visible only below lg */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="block">
          <Logo />
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-xl border border-line text-ink"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Desktop fixed sidebar — visible only on lg and up */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-line bg-paper/60 lg:flex">
        {navContent}
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-paper">
            <div className="flex items-center justify-end border-b border-line/60 px-3 py-2">
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-full text-ink-muted transition hover:bg-cream-soft hover:text-ink"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

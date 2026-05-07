"use client";

import Link from "next/link";
import { TopBar } from "@/components/app/TopBar";
import { RideCard } from "@/components/app/RideCard";
import {
  useDriverEarnings,
  useMyBookings,
  useMyProfile,
  useRidesForBookings,
  useUpcomingRides,
} from "@/lib/queries";
import { useAuth } from "@/lib/auth-context";
import { ArrowUpRight, Star, TrendingUp, IndianRupee } from "lucide-react";
import type { Booking } from "@/lib/firestore-types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useMyProfile();
  const { rides, loading: ridesLoading } = useUpcomingRides(6);
  const { bookings } = useMyBookings();
  const ridesByBooking = useRidesForBookings(bookings);
  const earnings = useDriverEarnings();

  const firstName =
    (profile?.name || user?.displayName || "rider").split(" ")[0];

  return (
    <>
      <TopBar
        eyebrow={`Good ${greeting()}, ${firstName}`}
        title="Dashboard"
      />

      <div className="flex-1 space-y-12 px-4 py-8 sm:px-6 lg:px-10 lg:py-10 scroll-elegant">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            label="Earnings (collected)"
            value={`₹${earnings.totalEarnings.toLocaleString("en-IN")}`}
            sub={
              earnings.uncollected > 0
                ? `₹${earnings.uncollected.toLocaleString("en-IN")} uncollected`
                : "Live · cash on arrival"
            }
            icon={IndianRupee}
            accent="lime"
          />
          <Stat
            label="Trips completed"
            value={String(earnings.tripsCompleted)}
            sub={`${earnings.ridersPaid} riders paid`}
            icon={TrendingUp}
            accent="ink"
          />
          <Stat
            label="Your rating"
            value={
              profile?.ratingCount && profile.ratingCount > 0
                ? (profile.rating ?? 0).toFixed(2)
                : "New"
            }
            sub={
              profile?.ratingCount && profile.ratingCount > 0
                ? `${profile.ratingCount} reviews`
                : "Take your first trip"
            }
            icon={Star}
            accent="amber"
          />
        </section>

        <section>
          <SectionHeader
            eyebrow="· Headed your way"
            title="Rides leaving soon"
            href="/app/search"
            cta="See all"
          />
          {ridesLoading ? (
            <SkeletonGrid />
          ) : rides.length === 0 ? (
            <EmptyState
              title="No active rides right now."
              body="Check back soon, or be the first to publish one for your route."
              cta="Publish a ride →"
              href="/app/publish"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {rides.slice(0, 4).map((r) => (
                <RideCard key={r.rideId} ride={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            eyebrow="· Recent activity"
            title="My bookings"
            href="/app/bookings"
            cta="All bookings"
          />
          {bookings.length === 0 ? (
            <EmptyState
              title="You haven't booked any rides yet."
              body="Find a ride going your way and tap Request — drivers usually approve within minutes."
              cta="Find a ride →"
              href="/app/search"
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-cream-soft">
                  <tr className="text-left">
                    {["Route", "Driver", "Seats", "Total", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {bookings.slice(0, 5).map((b) => {
                    const ride = ridesByBooking[b.rideId];
                    return (
                      <tr
                        key={b.bookingId}
                        className="transition hover:bg-cream-soft/40"
                      >
                        <td className="px-5 py-4">
                          <div className="font-display font-semibold">
                            {ride
                              ? `${ride.from}  →  ${ride.to}`
                              : "Loading…"}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                            {ride?.departureTime
                              ? ride.departureTime
                                  .toDate()
                                  .toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })
                              : "—"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-ink-soft">
                          {ride?.driverName ?? "—"}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">
                          {b.seats} seat{b.seats > 1 ? "s" : ""}
                        </td>
                        <td className="px-5 py-4 font-display font-semibold">
                          {ride
                            ? `₹${(ride.pricePerSeat ?? 0) * b.seats}`
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill
                            status={effectiveStatus(b, ride?.status)}
                          />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href="/app/bookings"
                            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "evening";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function effectiveStatus(b: Booking, rideStatus?: string): string {
  if (b.status === "cancelled") return "cancelled";
  if (rideStatus === "completed") return "completed";
  if (rideStatus === "in_progress") return "in_progress";
  return b.status;
}

function Stat({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: "lime" | "ink" | "amber";
}) {
  const bg =
    accent === "lime"
      ? "bg-lime text-ink"
      : accent === "amber"
      ? "bg-amber text-ink"
      : "bg-ink text-cream";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-paper p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            {label}
          </div>
          <div className="mt-3 font-display text-4xl font-bold tracking-tight">
            {value}
          </div>
        </div>
        <div className={`grid size-10 place-items-center rounded-xl ${bg}`}>
          <Icon className="size-4" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        <ArrowUpRight className="size-3" strokeWidth={2} />
        {sub}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
          {eyebrow}
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink"
      >
        {cta} <ArrowUpRight className="size-3" strokeWidth={2} />
      </Link>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber/30", text: "text-ink", label: "Pending" },
    confirmed: { bg: "bg-lime", text: "text-ink", label: "Confirmed" },
    in_progress: { bg: "bg-amber/30", text: "text-ink", label: "On the way" },
    completed: { bg: "bg-cream-soft", text: "text-ink-soft", label: "Completed" },
    cancelled: { bg: "bg-coral/20", text: "text-coral", label: "Cancelled" },
  };
  const m = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${m.bg} ${m.text}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-60" />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
        {m.label}
      </span>
    </span>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl border border-line bg-paper/60"
        />
      ))}
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
      <div className="font-display text-2xl font-semibold">{title}</div>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-ink-soft"
      >
        {cta}
      </Link>
    </div>
  );
}

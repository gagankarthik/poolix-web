"use client";

import { TopBar } from "@/components/app/TopBar";
import { useMyBookings, useRidesForBookings } from "@/lib/queries";

function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

const STATUS_BG: Record<string, string> = {
  confirmed: "bg-lime text-ink",
  pending: "bg-amber/30 text-ink",
  completed: "bg-cream-soft text-ink-soft",
  cancelled: "bg-coral/20 text-coral",
};

export default function BookingsPage() {
  const { bookings, loading } = useMyBookings();
  const ridesByBooking = useRidesForBookings(bookings);

  return (
    <>
      <TopBar eyebrow="· Your trips" title="My bookings" />
      <div className="px-10 py-10 space-y-4">
        {loading && (
          <div className="text-ink-muted font-mono text-xs uppercase tracking-[0.18em]">
            Loading…
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
            <div className="font-display text-2xl font-semibold">
              No bookings yet.
            </div>
            <p className="mt-2 text-ink-soft">
              Find a ride and tap Request — drivers usually approve within
              minutes.
            </p>
          </div>
        )}

        {bookings.map((b) => {
          const ride = ridesByBooking[b.rideId];
          const driverInitial = (ride?.driverName ?? "D").charAt(0).toUpperCase();
          const hue = hueFromId(b.driverId || b.bookingId);
          const status: string =
            b.status === "cancelled"
              ? "cancelled"
              : ride?.status === "completed"
              ? "completed"
              : ride?.status === "in_progress"
              ? "in_progress"
              : b.status;

          return (
            <article
              key={b.bookingId}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-2xl border border-line bg-paper p-6"
            >
              <div
                className="grid size-12 place-items-center overflow-hidden rounded-full font-display text-xl font-semibold text-ink"
                style={{ background: `hsl(${hue} 60% 75%)` }}
              >
                {ride?.driverPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ride.driverPhotoUrl}
                    alt={ride.driverName ?? "Driver"}
                    className="size-full object-cover"
                  />
                ) : (
                  driverInitial
                )}
              </div>
              <div>
                <div className="font-display text-2xl font-semibold leading-tight">
                  {ride
                    ? `${ride.from}  →  ${ride.to}`
                    : "Loading ride…"}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {ride?.departureTime
                    ? ride.departureTime.toDate().toLocaleString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : ""}
                  {ride && " · "}
                  {b.seats} seat{b.seats > 1 ? "s" : ""}
                  {ride && ` · ₹${(ride.pricePerSeat ?? 0) * b.seats}`}
                </div>
                <div className="mt-2 text-sm text-ink-soft">
                  {ride?.driverName ?? "—"}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    STATUS_BG[status] ?? STATUS_BG.pending
                  }`}
                >
                  {status === "in_progress" ? "On the way" : status}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

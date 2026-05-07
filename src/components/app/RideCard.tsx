import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Ride } from "@/lib/mock";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function RideCard({ ride }: { ride: Ride }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-paper transition hover:border-ink/30 hover:shadow-[0_18px_40px_-22px_rgba(10,15,31,0.25)]">
      <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-6 p-5">
        {/* Driver avatar column */}
        <div className="flex flex-col items-center">
          <div
            className="grid size-14 place-items-center rounded-full font-display text-xl font-semibold text-ink ring-2 ring-lime"
            style={{ background: `hsl(${ride.driver.avatarHue} 60% 75%)` }}
          >
            {ride.driver.name.charAt(0)}
          </div>
          <div className="mt-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              ★ {ride.driver.rating}
            </div>
            <div className="font-mono text-[10px] text-ink-muted">
              {ride.driver.trips} trips
            </div>
          </div>
        </div>

        {/* Route + meta */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <h3 className="truncate font-display text-2xl font-bold leading-tight">
              {ride.from} <span className="text-ink-muted">→</span> {ride.to}
            </h3>
            {ride.stops?.length ? (
              <span className="rounded-full bg-cream-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                via {ride.stops.join(", ")}
              </span>
            ) : null}
          </div>

          <div className="mt-1 text-sm text-ink-soft">{ride.driver.name}</div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" strokeWidth={1.75} />
              {formatTime(ride.departsAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" strokeWidth={1.75} />
              {formatDuration(ride.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" strokeWidth={1.75} />
              {ride.vehicle}
            </span>
          </div>
        </div>

        {/* Price + seats */}
        <div className="flex flex-col items-end justify-between text-right">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              per seat
            </div>
            <div className="font-display text-3xl font-bold leading-none">
              ₹{ride.pricePerSeat}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              <Users className="size-3" strokeWidth={2} />
              {ride.seatsLeft}/{ride.seatsTotal}
            </span>
            <button className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition group-hover:bg-coral">
              Request
            </button>
          </div>
        </div>
      </div>

      {/* Active band */}
      {ride.status === "active" && (
        <div className="flex items-center gap-1.5 border-t border-line/60 bg-cream-soft/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <span className="size-1.5 rounded-full bg-lime-deep" />
          {ride.seatsLeft === 0
            ? "Fully booked"
            : `${ride.seatsLeft} seat${ride.seatsLeft > 1 ? "s" : ""} available`}
        </div>
      )}
    </article>
  );
}

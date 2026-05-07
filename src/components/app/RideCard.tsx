import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Ride } from "@/lib/firestore-types";

function formatTime(ts: Ride["departureTime"]) {
  if (!ts) return "—";
  const d = ts.toDate();
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Stable per-driver hue so repeat sightings keep the same avatar tint. */
function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

function vehicleLine(ride: Ride): string {
  const parts: string[] = [];
  if (ride.vehicleModel) parts.push(ride.vehicleModel);
  else if (ride.vehicleType) parts.push(ride.vehicleType);
  if (ride.vehicleColor) parts.push(ride.vehicleColor);
  if (ride.vehicleNumber) parts.push(ride.vehicleNumber);
  return parts.join(" · ");
}

export function RideCard({ ride }: { ride: Ride }) {
  const initial = (ride.driverName || "D").charAt(0).toUpperCase();
  const hue = hueFromId(ride.driverId || ride.rideId);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-paper transition hover:border-ink/30 hover:shadow-[0_18px_40px_-22px_rgba(10,15,31,0.25)]">
      <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-6 p-5">
        <div className="flex flex-col items-center">
          <div
            className="grid size-14 place-items-center overflow-hidden rounded-full font-display text-xl font-semibold text-ink ring-2 ring-lime"
            style={{ background: `hsl(${hue} 60% 75%)` }}
          >
            {ride.driverPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ride.driverPhotoUrl}
                alt={ride.driverName ?? "Driver"}
                className="size-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-display text-2xl font-bold leading-tight">
            {ride.from} <span className="text-ink-muted">→</span> {ride.to}
          </h3>
          <div className="mt-1 text-sm text-ink-soft">
            {ride.driverName || "Driver"}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" strokeWidth={1.75} />
              {formatTime(ride.departureTime)}
            </span>
            {vehicleLine(ride) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" strokeWidth={1.75} />
                {vehicleLine(ride)}
              </span>
            )}
            {ride.waypoints && ride.waypoints.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" strokeWidth={1.75} />
                via {ride.waypoints.join(", ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between text-right">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              per seat
            </div>
            <div className="font-display text-3xl font-bold leading-none">
              ₹{Math.round(ride.pricePerSeat ?? 0)}
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

      {ride.status === "active" && (
        <div className="flex items-center gap-1.5 border-t border-line/60 bg-cream-soft/60 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <span className="size-1.5 rounded-full bg-lime-deep" />
          {(ride.seatsLeft ?? 0) === 0
            ? "Fully booked"
            : `${ride.seatsLeft} seat${(ride.seatsLeft ?? 0) > 1 ? "s" : ""} available`}
        </div>
      )}
    </article>
  );
}

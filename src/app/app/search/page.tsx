"use client";

import { useState } from "react";
import { TopBar } from "@/components/app/TopBar";
import { RideCard } from "@/components/app/RideCard";
import { useSearchRides, useUpcomingRides } from "@/lib/queries";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

export default function SearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("Today");
  const [seats, setSeats] = useState(1);

  const searchActive = from.trim() !== "" || to.trim() !== "";
  const search = useSearchRides(from.trim(), to.trim());
  const upcoming = useUpcomingRides(20);
  const list = searchActive ? search.rides : upcoming.rides;
  const loading = searchActive ? search.loading : upcoming.loading;

  // Filter by seats client-side so the user's preference is respected.
  const filtered = list.filter((r) => (r.seatsLeft ?? 0) >= seats);

  return (
    <>
      <TopBar eyebrow="· Find a ride" title="Where are you headed?" />

      <div className="space-y-10 px-10 py-10 scroll-elegant">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-1 shadow-[0_24px_60px_-30px_rgba(10,15,31,0.4)]">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-px overflow-hidden rounded-[22px] bg-line">
            <Field
              icon={<MapPin className="size-4" strokeWidth={1.75} />}
              label="From"
              value={from}
              onChange={setFrom}
              placeholder="Bengaluru"
            />
            <Field
              icon={<MapPin className="size-4 rotate-180" strokeWidth={1.75} />}
              label="To"
              value={to}
              onChange={setTo}
              placeholder="Mysuru"
            />
            <Field
              icon={<Calendar className="size-4" strokeWidth={1.75} />}
              label="When"
              value={date}
              onChange={setDate}
              compact
            />
            <SeatStepper value={seats} onChange={setSeats} />
            <button className="h-full bg-lime px-8 font-display text-base font-semibold text-ink transition hover:bg-lime-deep">
              Search
            </button>
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {loading
                ? "Loading rides…"
                : `${filtered.length} ride${filtered.length === 1 ? "" : "s"}`}
              <span className="text-ink-muted">
                {searchActive
                  ? ` · ${from || "anywhere"} → ${to || "anywhere"}`
                  : " · departing soon"}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {loading
              ? [0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse rounded-2xl border border-line bg-paper/60"
                  />
                ))
              : filtered.map((r) => <RideCard key={r.rideId} ride={r} />)}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
                <div className="font-display text-2xl font-semibold">
                  No matching rides today.
                </div>
                <p className="mt-2 text-ink-soft">
                  Try a different city pair, fewer seats, or be the first to
                  publish a ride for this route.
                </p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-ink-soft">
                  Create alert <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1 bg-paper px-5 py-4 ${
        compact ? "min-w-44" : ""
      }`}
    >
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        {icon}
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-display text-xl font-semibold text-ink placeholder:text-ink-muted/60 focus:outline-none"
      />
    </label>
  );
}

function SeatStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1 bg-paper px-5 py-4">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        <Users className="size-4" strokeWidth={1.75} />
        Seats
      </span>
      <div className="flex items-center gap-3">
        <button
          aria-label="Fewer seats"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="grid size-7 place-items-center rounded-full border border-line text-ink transition hover:border-ink"
        >
          −
        </button>
        <span className="w-4 text-center font-display text-xl font-semibold">
          {value}
        </span>
        <button
          aria-label="More seats"
          onClick={() => onChange(Math.min(6, value + 1))}
          className="grid size-7 place-items-center rounded-full border border-line text-ink transition hover:border-ink"
        >
          +
        </button>
      </div>
    </div>
  );
}

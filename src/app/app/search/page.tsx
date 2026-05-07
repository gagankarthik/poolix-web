"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/app/TopBar";
import { RideCard } from "@/components/app/RideCard";
import { upcomingRides } from "@/lib/mock";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

export default function SearchPage() {
  const [from, setFrom] = useState("Bengaluru");
  const [to, setTo] = useState("Mysuru");
  const [date, setDate] = useState("Today");
  const [seats, setSeats] = useState(1);

  const results = useMemo(() => {
    return upcomingRides.filter(
      (r) =>
        r.from.toLowerCase().includes(from.trim().toLowerCase()) ||
        r.to.toLowerCase().includes(to.trim().toLowerCase()) ||
        from.trim() === "" ||
        to.trim() === ""
    );
  }, [from, to]);

  return (
    <>
      <TopBar eyebrow="· Find a ride" title="Where are you headed?" />

      <div className="space-y-10 px-10 py-10 scroll-elegant">
        {/* Search form */}
        <div className="relative overflow-hidden rounded-3xl bg-ink p-1 shadow-[0_24px_60px_-30px_rgba(10,15,31,0.4)]">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-px overflow-hidden rounded-[22px] bg-line">
            <Field
              icon={<MapPin className="size-4" strokeWidth={1.75} />}
              label="From"
              value={from}
              onChange={setFrom}
            />
            <Field
              icon={<MapPin className="size-4 rotate-180" strokeWidth={1.75} />}
              label="To"
              value={to}
              onChange={setTo}
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

        {/* Results */}
        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {results.length} ride{results.length === 1 ? "" : "s"}{" "}
              <span className="text-ink-muted">
                · {from || "anywhere"} → {to || "anywhere"}
              </span>
            </h2>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
              <span>Sort by</span>
              <select className="rounded-md border border-line bg-paper px-2 py-1 text-ink">
                <option>Departure time</option>
                <option>Price (low to high)</option>
                <option>Driver rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {results.map((r) => (
              <RideCard key={r.id} ride={r} />
            ))}
            {results.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
                <div className="font-display text-2xl font-semibold">
                  No rides match those cities yet.
                </div>
                <p className="mt-2 text-ink-soft">
                  Try a nearby town, or set up an alert and we&apos;ll ping you
                  the moment a driver posts a matching trip.
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
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-display text-xl font-semibold text-ink focus:outline-none"
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

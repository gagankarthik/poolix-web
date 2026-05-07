"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/app/TopBar";
import { RideCard } from "@/components/app/RideCard";
import { useSearchRides, useUpcomingRides } from "@/lib/queries";
import {
  PlaceAutocomplete,
  type PickedPlace,
} from "@/components/maps/PlaceAutocomplete";
import { RouteMap } from "@/components/maps/RouteMap";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

type LatLng = { lat: number; lng: number };

export default function SearchPage() {
  // useSearchParams() requires a Suspense boundary in Next 15+.
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  );
}

function SearchInner() {
  const params = useSearchParams();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromLatLng, setFromLatLng] = useState<LatLng | null>(null);
  const [toLatLng, setToLatLng] = useState<LatLng | null>(null);
  const [date, setDate] = useState("Today");
  const [seats, setSeats] = useState(1);

  // Pre-fill from URL query (e.g. ?from=Bengaluru&to=Mysuru&seats=2) so a
  // landing-page search lands here with values already in the form.
  useEffect(() => {
    const qFrom = params.get("from");
    const qTo = params.get("to");
    const qSeats = params.get("seats");
    const qDate = params.get("date");
    if (qFrom) setFrom(qFrom);
    if (qTo) setTo(qTo);
    if (qSeats) setSeats(Math.max(1, Math.min(6, Number(qSeats) || 1)));
    if (qDate) setDate(qDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchActive = from.trim() !== "" || to.trim() !== "";
  const search = useSearchRides(from.trim(), to.trim());
  const upcoming = useUpcomingRides(20);
  const list = searchActive ? search.rides : upcoming.rides;
  const loading = searchActive ? search.loading : upcoming.loading;

  const filtered = list.filter((r) => (r.seatsLeft ?? 0) >= seats);

  function onPickFrom(p: PickedPlace) {
    setFrom(p.primaryText);
    if (p.lat != null && p.lng != null) setFromLatLng({ lat: p.lat, lng: p.lng });
  }
  function onPickTo(p: PickedPlace) {
    setTo(p.primaryText);
    if (p.lat != null && p.lng != null) setToLatLng({ lat: p.lat, lng: p.lng });
  }

  return (
    <>
      <TopBar eyebrow="· Find a ride" title="Where are you headed?" />

      <div className="space-y-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-10 scroll-elegant">
        {/* Search form */}
        <div className="relative overflow-visible rounded-3xl bg-ink p-1 shadow-[0_24px_60px_-30px_rgba(10,15,31,0.4)]">
          <div className="grid grid-cols-1 items-center gap-px overflow-visible rounded-[22px] bg-line sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto]">
            <PlaceAutocomplete
              label="From"
              icon={<MapPin className="size-4" strokeWidth={1.75} />}
              value={from}
              onChangeText={(v) => {
                setFrom(v);
                if (!v) setFromLatLng(null);
              }}
              onPick={onPickFrom}
              placeholder="Bengaluru"
            />
            <PlaceAutocomplete
              label="To"
              icon={<MapPin className="size-4 rotate-180" strokeWidth={1.75} />}
              value={to}
              onChangeText={(v) => {
                setTo(v);
                if (!v) setToLatLng(null);
              }}
              onPick={onPickTo}
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
            <button className="bg-lime px-8 py-5 font-display text-base font-semibold text-ink transition hover:bg-lime-deep lg:py-0 lg:h-full">
              Search
            </button>
          </div>
        </div>

        {/* Live route preview */}
        {(fromLatLng || toLatLng) && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(0,2fr)]">
            <div className="rounded-3xl border border-line bg-paper p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                · Route preview
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-3 rounded-full border-2 border-ink bg-lime" />
                  <div>
                    <div className="font-display text-lg font-semibold leading-tight">
                      {from || "—"}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      {fromLatLng
                        ? `${fromLatLng.lat.toFixed(3)}, ${fromLatLng.lng.toFixed(3)}`
                        : "Pick a place from suggestions"}
                    </div>
                  </div>
                </div>
                <div className="ml-1.5 h-6 w-px bg-line" />
                <div className="flex items-start gap-3">
                  <span className="mt-1 size-3 rounded-full bg-coral" />
                  <div>
                    <div className="font-display text-lg font-semibold leading-tight">
                      {to || "—"}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      {toLatLng
                        ? `${toLatLng.lat.toFixed(3)}, ${toLatLng.lng.toFixed(3)}`
                        : "Pick a place from suggestions"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <RouteMap origin={fromLatLng} destination={toLatLng} className="h-72 w-full overflow-hidden rounded-3xl border border-line bg-paper" />
          </div>
        )}

        {/* Results */}
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

/**
 * Landing-page search card. Drops into the hero's right column as a vertical
 * stack so it sits comfortably alongside a wide headline and stays readable
 * on phones. Submits to /app/search with URL params; the auth gate on /app
 * redirects unauthenticated visitors to /login first, then back here.
 */
export function HeroSearch() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("Today");
  const [seats, setSeats] = useState(1);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    if (seats > 1) params.set("seats", String(seats));
    if (date && date !== "Today") params.set("date", date);
    router.push(`/app/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={search}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-paper/95 shadow-[0_30px_60px_-30px_rgba(10,15,31,0.25)] backdrop-blur"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-line/60 px-6 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
          · Find a ride
        </span>
        <span className="rounded-full bg-lime px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          Free to search
        </span>
      </div>

      {/* Stacked route fields connected by a vertical line — visual echo of
          the trip ticket — origin pin → destination pin */}
      <div className="relative px-6 pt-6">
        {/* Left rail */}
        <div className="pointer-events-none absolute left-9 top-12 bottom-12 flex flex-col items-center">
          <span className="size-3 rounded-full border-2 border-ink bg-lime" />
          <span className="my-1 flex-1 w-px bg-ink/30" />
          <span className="size-3 rounded-full bg-coral" />
        </div>

        <Field
          label="From"
          value={from}
          onChange={setFrom}
          placeholder="Bengaluru"
        />
        <div className="my-1 ml-12 h-px w-[calc(100%-3rem)] bg-line" />
        <Field
          label="To"
          value={to}
          onChange={setTo}
          placeholder="Mysuru"
        />
      </div>

      {/* Bottom row — when + seats */}
      <div className="grid grid-cols-2 gap-px border-t border-line/60 bg-line">
        <DateField value={date} onChange={setDate} />
        <SeatStepper value={seats} onChange={setSeats} />
      </div>

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-3 bg-ink py-5 font-display text-base font-semibold text-cream transition hover:bg-ink-soft"
      >
        Search rides
        <span className="grid size-7 place-items-center rounded-full bg-lime text-ink transition group-hover:translate-x-0.5">
          <ArrowRight className="size-4" strokeWidth={2.25} />
        </span>
      </button>

      {/* Footer micro-CTA */}
      <div className="border-t border-line/60 bg-cream-soft/50 px-6 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        12,400+ verified drivers · Cash on arrival
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-0.5 pl-12 pr-2 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
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

function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 bg-paper px-5 py-4">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        <Calendar className="size-3.5" strokeWidth={1.75} />
        When
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-display text-lg font-semibold text-ink focus:outline-none"
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
        <Users className="size-3.5" strokeWidth={1.75} />
        Seats
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Fewer seats"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="grid size-7 place-items-center rounded-full border border-line text-ink transition hover:border-ink"
        >
          −
        </button>
        <span className="w-4 text-center font-display text-lg font-semibold">
          {value}
        </span>
        <button
          type="button"
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

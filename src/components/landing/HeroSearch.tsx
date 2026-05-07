"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

/**
 * Landing-page search bar. Forms a URL query and routes the user into the
 * /app/search page (which is auth-gated and will bounce to /login first).
 *
 * Lives below the hero so visitors can start a real search before they sign
 * in — first booking attempt on the results screen is what triggers auth.
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
      className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-ink/10 bg-paper/95 shadow-[0_30px_60px_-30px_rgba(10,15,31,0.25)] backdrop-blur"
    >
      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto]">
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
        <button
          type="submit"
          className="bg-lime px-8 py-5 font-display text-base font-semibold text-ink transition hover:bg-lime-deep lg:py-0"
        >
          <span className="inline-flex items-center justify-center gap-2">
            Search
            <ArrowRight className="size-4" strokeWidth={2} />
          </span>
        </button>
      </div>
    </form>
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
        compact ? "lg:min-w-44" : ""
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
        className="bg-transparent font-display text-lg font-semibold text-ink placeholder:text-ink-muted/60 focus:outline-none sm:text-xl"
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
          type="button"
          aria-label="Fewer seats"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="grid size-7 place-items-center rounded-full border border-line text-ink transition hover:border-ink"
        >
          −
        </button>
        <span className="w-4 text-center font-display text-lg font-semibold sm:text-xl">
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

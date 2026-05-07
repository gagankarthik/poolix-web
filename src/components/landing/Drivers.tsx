"use client";

import { useState } from "react";

export function Drivers() {
  const [seats, setSeats] = useState(2);
  const [tripsPerWeek, setTripsPerWeek] = useState(3);
  const [perSeat, setPerSeat] = useState(380);

  const weekly = seats * tripsPerWeek * perSeat;
  const monthly = weekly * 4;

  return (
    <section id="drivers" className="border-t border-line/60 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-cream/50">
            · For drivers
          </div>
          <h2 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Already heading
            <br />
            <span className="text-lime">that direction?</span>
            <br />
            <span className="font-light italic">Get paid for the trip.</span>
          </h2>
          <p className="mt-8 max-w-md text-cream/80">
            Most Poolix drivers aren't taxi drivers — they're people who drive
            500 km a week to family, work, or the village, and pick up two
            passengers along the way. Cover your fuel. Make new friends.
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            {[
              "Set your own price per seat",
              "Approve every passenger before they book",
              "Cash collected at pickup, no commission for the first 1,000 trips",
              "We never share your phone number — chat happens in-app",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" />
                <span className="text-cream/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Earnings calculator */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-cream/10 bg-cream/[0.04] p-8 backdrop-blur">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/50">
              Earnings calculator
            </div>
            <div className="mt-2 font-display text-3xl font-semibold">
              How much could you make?
            </div>

            <div className="mt-10 space-y-8">
              <Field
                label="Seats per ride"
                value={seats}
                min={1}
                max={4}
                onChange={setSeats}
                suffix={seats === 1 ? "seat" : "seats"}
              />
              <Field
                label="Trips per week"
                value={tripsPerWeek}
                min={1}
                max={14}
                onChange={setTripsPerWeek}
                suffix="trips"
              />
              <Field
                label="Price per seat"
                value={perSeat}
                min={100}
                max={2000}
                step={20}
                onChange={setPerSeat}
                prefix="₹"
              />
            </div>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-cream/10">
              <div className="bg-ink p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/50">
                  Weekly
                </div>
                <div className="mt-2 font-display text-4xl font-bold tracking-tight">
                  ₹{weekly.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="bg-lime p-6 text-ink">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/60">
                  Monthly
                </div>
                <div className="mt-2 font-display text-4xl font-bold tracking-tight">
                  ₹{monthly.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
              · Estimate. Actual earnings depend on demand and your route.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/50">
          {label}
        </span>
        <span className="font-display text-3xl font-semibold">
          {prefix}
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-cream/50">
              {suffix}
            </span>
          )}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1 w-full appearance-none rounded-full bg-cream/15
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:size-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-lime
                   [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-ink
                   [&::-webkit-slider-thumb]:cursor-grab
                   [&::-webkit-slider-thumb]:active:cursor-grabbing
                   [&::-moz-range-thumb]:size-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-lime
                   [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-ink"
      />
    </div>
  );
}

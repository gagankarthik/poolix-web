"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="grain relative overflow-hidden">
      {/* Decorative diagonal stripe band */}
      <div
        aria-hidden
        className="absolute -right-32 top-24 h-40 w-[60%] rotate-[-8deg] stripes opacity-[0.06]"
      />

      {/* Floating coral disc */}
      <motion.div
        aria-hidden
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-[-180px] top-[-120px] size-[480px] rounded-full bg-coral/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-28 pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-32">
        {/* Headline */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/60 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-ink-soft backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-lime-deep" />
            India · v1.0 · Now in beta
          </motion.div>

          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="block"
            >
              Share the
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="block"
            >
              road,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">split</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-2 -z-0 h-4 bg-lime"
                />
              </span>{" "}
              the
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="block italic font-light"
            >
              <span className="font-display">cost.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 max-w-xl text-lg text-ink-soft sm:text-xl"
          >
            Poolix matches you with verified drivers heading the same way you
            are. No surge pricing. No mystery fees. Just two strangers, one
            playlist, and a fairer way to travel India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/app"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-sm font-medium text-cream transition hover:bg-ink-soft"
            >
              Find a ride
              <span className="grid size-6 place-items-center rounded-full bg-lime text-ink transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="#drivers"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-soft px-6 py-4 text-sm font-medium text-ink transition hover:border-ink/40"
            >
              I'm a driver
            </Link>
            <div className="ml-2 flex items-center gap-2 text-sm text-ink-muted">
              <span className="flex -space-x-2">
                {[28, 142, 305].map((hue) => (
                  <span
                    key={hue}
                    className="size-7 rounded-full border-2 border-cream"
                    style={{
                      background: `hsl(${hue} 60% 70%)`,
                    }}
                  />
                ))}
              </span>
              <span className="font-medium text-ink">12,400+</span>
              <span>verified drivers</span>
            </div>
          </motion.div>
        </div>

        {/* Right column — animated route ticket */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-5"
        >
          <RouteTicket />
        </motion.div>
      </div>

      {/* Marquee trust strip */}
      <div className="border-y border-line/60 bg-paper/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-12 overflow-hidden py-6">
          <div className="flex shrink-0 items-center gap-12 marquee whitespace-nowrap">
            {[
              "OTP-verified phones",
              "Government ID checks",
              "Driving licence on file",
              "Real names. Real photos.",
              "5-star ratings, both ways",
              "Cash-on-arrival, transparent",
              "Made for Indian roads",
            ]
              .concat([
                "OTP-verified phones",
                "Government ID checks",
                "Driving licence on file",
                "Real names. Real photos.",
              ])
              .map((label, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted"
                >
                  <span className="size-1.5 rounded-full bg-lime-deep" />
                  {label}
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RouteTicket() {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Drop shadow stack */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-ink/5" />
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-3xl bg-ink/8" />

      <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-[0_30px_60px_-24px_rgba(10,15,31,0.25)]">
        {/* Top header */}
        <div className="flex items-center justify-between border-b border-dashed border-line px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            ride no. 0421
          </span>
          <span className="rounded-full bg-lime px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
            ✓ Confirmed
          </span>
        </div>

        {/* Route */}
        <div className="px-6 pt-6">
          <div className="flex items-start gap-4">
            <div className="mt-2 flex flex-col items-center">
              <span className="size-3 rounded-full border-2 border-ink bg-lime" />
              <span className="my-1 h-12 w-px bg-ink" />
              <span className="size-3 rounded-full bg-coral" />
            </div>
            <div className="flex-1">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  From
                </div>
                <div className="font-display text-2xl font-semibold leading-tight">
                  Bengaluru
                </div>
                <div className="text-xs text-ink-muted">06:00 AM · Mon</div>
              </div>
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  To
                </div>
                <div className="font-display text-2xl font-semibold leading-tight">
                  Mysuru
                </div>
                <div className="text-xs text-ink-muted">~3h 15m · 1 stop</div>
              </div>
            </div>
          </div>
        </div>

        {/* Driver row */}
        <div className="mt-6 flex items-center gap-3 border-t border-dashed border-line px-6 py-4">
          <div
            className="grid size-10 place-items-center rounded-full font-display font-semibold text-ink"
            style={{ background: "hsl(142 60% 75%)" }}
          >
            A
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Aanya Iyer</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              ★ 4.9 · 47 trips · ID verified
            </div>
          </div>
          <button className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream">
            Message
          </button>
        </div>

        {/* Tear */}
        <div className="relative h-6 border-t border-dashed border-line">
          <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-cream" />
          <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-cream" />
        </div>

        {/* Total */}
        <div className="flex items-end justify-between px-6 pb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Per seat
            </div>
            <div className="font-display text-3xl font-bold">
              ₹380<span className="text-sm font-medium text-ink-muted"> / seat</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              2 / 4 left
            </div>
            <div className="mt-1 flex gap-1">
              {[1, 1, 0, 0].map((s, i) => (
                <span
                  key={i}
                  className={`h-2 w-5 rounded-full ${
                    s ? "bg-lime" : "bg-line"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating annotation */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="drift absolute -bottom-6 -left-8 hidden rotate-[-6deg] rounded-2xl border border-ink/10 bg-cream px-4 py-3 shadow-lg sm:block"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          You save vs Uber
        </div>
        <div className="font-display text-2xl font-bold text-coral">−₹620</div>
      </motion.div>
    </div>
  );
}

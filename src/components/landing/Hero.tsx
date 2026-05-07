"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroSearch } from "@/components/landing/HeroSearch";

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

        {/* Right column — interactive search card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-5"
        >
          <HeroSearch />
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


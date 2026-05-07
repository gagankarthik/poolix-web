"use client";

import { Bell, Search } from "lucide-react";

export function TopBar({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line/60 bg-cream/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-10 lg:py-6">
      <div className="min-w-0">
        {eyebrow && (
          <div className="truncate font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Quick search…  ⌘K"
            className="w-72 rounded-xl border border-line bg-paper/80 py-2.5 pl-9 pr-3 text-sm font-medium placeholder:text-ink-muted focus:border-ink focus:outline-none"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-line bg-paper transition hover:border-ink/40"
        >
          <Bell className="size-4" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-coral ring-2 ring-paper" />
        </button>
      </div>
    </header>
  );
}

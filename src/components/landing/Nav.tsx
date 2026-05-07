"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#how" className="text-sm font-medium text-ink-soft hover:text-ink transition">
            How it works
          </Link>
          <Link href="#trust" className="text-sm font-medium text-ink-soft hover:text-ink transition">
            Trust &amp; safety
          </Link>
          <Link href="#drivers" className="text-sm font-medium text-ink-soft hover:text-ink transition">
            For drivers
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-ink-soft hover:text-ink transition">
            Privacy
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {/* Auth-aware primary action — open the app if signed in, sign in if not. */}
          {!loading && user ? (
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:bg-ink-soft"
            >
              Open the app
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:bg-ink-soft"
            >
              Sign in
              <span aria-hidden>→</span>
            </Link>
          )}
          <Link
            href="#download"
            className="hidden items-center gap-2 rounded-full border border-ink/15 bg-cream-soft px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/40 sm:inline-flex"
          >
            Download
            <span aria-hidden>↓</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

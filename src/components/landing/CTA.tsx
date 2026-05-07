import Link from "next/link";

export function CTA() {
  return (
    <section id="download" className="border-t border-line/60 bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-32">
        <div className="relative overflow-hidden rounded-3xl bg-lime p-12 sm:p-20">
          <div
            aria-hidden
            className="absolute -right-40 -top-32 size-[480px] rounded-full bg-coral opacity-50 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-20 size-[360px] rounded-full bg-ink/15 blur-3xl"
          />

          <div className="relative">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink/60">
              · Get the app
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
              Your next ride is
              <br />
              already on the road.
            </h2>
            <p className="mt-6 max-w-xl text-ink-soft">
              Free for the first 1,000 rides each month. Available on Android
              today, iOS in beta. Always India-first.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <StoreBadge
                store="Google Play"
                tagline="Get it on"
                icon={
                  <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M3.6 2.3 13.7 12 3.6 21.7c-.4-.3-.6-.7-.6-1.2V3.5c0-.5.2-.9.6-1.2zm12 8.7L5.5 1.5l11.2 6.5-1.1 3zm3.7 1L23 14l-3.4 1.9-1.6-2.9 1.3-2zm-3.7 1 1.1 3-11.2 6.5 10.1-9.5z"
                    />
                  </svg>
                }
              />
              <StoreBadge
                store="App Store"
                tagline="Coming soon to"
                muted
                icon={
                  <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M16.6 13c0-2.5 2-3.7 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.3 9.8.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.4-2.7-.1 0-2.7-1-2.9-4zM14.7 5.6c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.6 2.9-1.3z"
                    />
                  </svg>
                }
              />
              <Link
                href="/app"
                className="ml-auto hidden items-center gap-2 rounded-full border-2 border-ink bg-cream px-6 py-4 font-display text-lg font-semibold text-ink transition hover:bg-ink hover:text-cream sm:inline-flex"
              >
                Or, try the web app
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreBadge({
  store,
  tagline,
  icon,
  muted,
}: {
  store: string;
  tagline: string;
  icon: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <button
      className={`group inline-flex items-center gap-3 rounded-2xl border-2 border-ink ${
        muted ? "bg-cream-soft text-ink/60" : "bg-ink text-cream"
      } px-5 py-3 transition hover:scale-[1.02]`}
    >
      <span>{icon}</span>
      <span className="text-left">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
          {tagline}
        </span>
        <span className="block font-display text-xl font-semibold">{store}</span>
      </span>
    </button>
  );
}

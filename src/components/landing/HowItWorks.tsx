const steps = [
  {
    n: "01",
    title: "Search your route",
    body: "Type your start and end. Poolix shows every driver heading the same way today, ranked by departure time.",
    art: "search",
  },
  {
    n: "02",
    title: "Tap to request",
    body: "Pick how many seats you need. The driver gets a notification — most approve within 10 minutes.",
    art: "tap",
  },
  {
    n: "03",
    title: "Show up, share the road",
    body: "Cash on arrival, payment marked in-app. Rate your driver, they rate you. Everyone gets safer.",
    art: "drive",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-line/60 bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-20 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
            · How it works
          </div>
          <h2 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Three taps from
            <br />
            <em className="not-italic relative inline-block">
              <span className="relative z-10 italic font-light">stranger</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-lime" aria-hidden />
            </em>{" "}
            to seat-belt.
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {/* Connector dashes */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 md:block"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, var(--color-ink) 0 4px, transparent 4px 12px)",
                  }}
                />
              )}

              <div className="relative grid size-24 place-items-center rounded-2xl border-2 border-ink bg-paper">
                <span className="font-display text-3xl font-bold">{s.n}</span>
                <span className="absolute -right-2 -top-2 size-4 rotate-45 bg-lime" />
              </div>

              <h3 className="mt-8 font-display text-2xl font-semibold leading-tight">
                {s.title}
              </h3>
              <p className="mt-3 max-w-sm text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

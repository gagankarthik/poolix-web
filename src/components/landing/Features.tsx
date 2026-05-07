import { ShieldCheck, Wallet, MessageSquare, MapPin } from "lucide-react";

const features = [
  {
    eyebrow: "01",
    icon: ShieldCheck,
    title: "Verified, both ways",
    body: "Phone OTP, government ID, and driving licence on every driver. Riders see the green ring before they tap book.",
  },
  {
    eyebrow: "02",
    icon: Wallet,
    title: "Honest, transparent fares",
    body: "Drivers post one price per seat. No surge. No hidden platform fee for the first 1,000 rides per month.",
  },
  {
    eyebrow: "03",
    icon: MessageSquare,
    title: "One thread per person",
    body: "Same driver next month? Same conversation. Unread badges, photos in the header, no spammy auto-messages.",
  },
  {
    eyebrow: "04",
    icon: MapPin,
    title: "On-the-way bookings",
    body: "Match passengers along the driver's route, not just at the endpoints. Smart geohash search keeps it instant.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-line/60 bg-paper/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
              · Why Poolix
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Built for trust,
              <br />
              priced for{" "}
              <span className="relative inline-block italic font-light">
                everyone
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-coral"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8 Q 50 2, 100 6 T 198 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h2>
          </div>
          <p className="text-ink-soft lg:col-span-5">
            Every choice we made — from the verification gate to the way the
            chat avatar shows up — exists so a complete stranger feels safe
            sliding into your back seat at 6 a.m.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article
              key={f.eyebrow}
              className="group relative bg-paper p-8 transition hover:bg-cream-soft"
            >
              <div className="mb-12 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
                  {f.eyebrow}
                </span>
                <f.icon className="size-5 text-ink-soft" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl font-semibold leading-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                {f.body}
              </p>
              <span
                aria-hidden
                className="absolute bottom-6 right-6 font-display text-xl text-ink-muted/40 transition group-hover:text-coral"
              >
                →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

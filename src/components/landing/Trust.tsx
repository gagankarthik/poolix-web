import { Phone, Mail, IdCard, FileBadge2 } from "lucide-react";

const layers = [
  {
    icon: Phone,
    title: "Phone OTP",
    body: "Every account starts with a six-digit code on a real Indian SIM. No throwaways.",
  },
  {
    icon: Mail,
    title: "Email on file",
    body: "Linked to a personal address — used only for receipts and password recovery.",
  },
  {
    icon: IdCard,
    title: "Government ID",
    body: "Aadhaar or PAN, encrypted at rest, visible only to Poolix support during disputes.",
  },
  {
    icon: FileBadge2,
    title: "Driving licence",
    body: "Required to publish a ride. Expiry tracked. Offers automatically pause on the day it expires.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="border-t border-line/60">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
            · Trust &amp; safety
          </div>
          <h2 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Four layers
            <br />
            before a green
            <br />
            <span className="italic font-light">tick.</span>
          </h2>
          <p className="mt-6 max-w-md text-ink-soft">
            We don't trust an algorithm to decide who's safe. We require four
            independent signals — and we show them all on every profile so
            passengers can decide for themselves.
          </p>
          <a
            href="#download"
            className="mt-8 inline-flex items-center gap-2 font-display text-lg underline decoration-coral decoration-2 underline-offset-4 transition hover:text-coral"
          >
            See a verified profile in the app →
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-px overflow-hidden rounded-3xl border border-ink/10">
            {layers.map((l, i) => (
              <article
                key={l.title}
                className="group flex items-start gap-6 bg-paper p-6 transition hover:bg-cream-soft"
              >
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-ink/10 bg-cream-soft text-ink transition group-hover:bg-lime">
                  <l.icon className="size-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-semibold">{l.title}</h3>
                    <span className="rounded-full bg-lime/30 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                      ✓ verified
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{l.body}</p>
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
                  0{i + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

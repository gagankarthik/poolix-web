import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/landing/Footer";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

type Props = {
  /** Eyebrow above the headline, e.g. "Last updated: 7 May 2026". */
  meta: string;
  /** Headline pieces — first is plain, second renders italic + underline. */
  titleLeft: string;
  titleRight: string;
  /** Lead paragraph below the headline. */
  intro: React.ReactNode;
  sections: Section[];
  /** Footer line beneath the last section. */
  closingLine?: string;
};

/**
 * Shared chrome for /privacy, /terms, /delete-account so the three docs
 * keep a single editorial voice and a sticky table-of-contents.
 */
export function LegalLayout({
  meta,
  titleLeft,
  titleRight,
  intro,
  sections,
  closingLine,
}: Props) {
  return (
    <div className="grain min-h-screen">
      <header className="border-b border-line/60 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            <Link href="/privacy" className="transition hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-ink">
              Terms
            </Link>
            <Link href="/delete-account" className="transition hover:text-ink">
              Delete account
            </Link>
            <Link href="/" className="transition hover:text-ink">
              ← Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
              Sections
            </div>
            <nav className="mt-4 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block border-l-2 border-line py-1 pl-3 text-sm text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  {s.title.replace(/^\d+ — /, "")}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="lg:col-span-9">
          <div className="border-b border-line/60 pb-12">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
              · {meta}
            </div>
            <h1 className="mt-4 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
              {titleLeft}
              <br />
              <span className="italic font-light">{titleRight}</span>
            </h1>
            <div className="mt-8 max-w-2xl text-lg text-ink-soft">{intro}</div>
          </div>

          <div className="space-y-16 pt-16">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-3xl font-semibold leading-tight">
                  {s.title}
                </h2>
                <div className="mt-4 max-w-3xl text-ink-soft leading-relaxed">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          {closingLine && (
            <div className="mt-24 border-t border-line/60 pt-8 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
              {closingLine}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}

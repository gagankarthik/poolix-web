import { TopBar } from "@/components/app/TopBar";

export default function PublishPage() {
  const steps = [
    "01 — Where are you driving from?",
    "02 — Where to?",
    "03 — Map your route",
    "04 — When do you leave?",
    "05 — Return trip?",
    "06 — How many seats?",
    "07 — Price per seat",
    "08 — Review and publish",
  ];

  return (
    <>
      <TopBar eyebrow="· Driver" title="Publish a ride" />
      <div className="grid flex-1 grid-cols-[18rem_1fr] gap-12 px-10 py-10">
        <aside>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            Wizard
          </div>
          <ol className="mt-4 space-y-1">
            {steps.map((s, i) => (
              <li
                key={s}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  i === 0
                    ? "bg-ink text-cream"
                    : "text-ink-soft"
                }`}
              >
                <span className="font-mono text-[10px] tracking-wider">
                  {s.split("—")[0].trim()}
                </span>
                <span className="text-sm">{s.split("—")[1]?.trim()}</span>
              </li>
            ))}
          </ol>
        </aside>

        <section className="rounded-3xl border border-line bg-paper p-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            Step 01
          </div>
          <h2 className="mt-3 font-display text-5xl font-bold leading-[0.95] tracking-tight">
            Where are
            <br />
            you driving
            <br />
            <em className="not-italic">
              <span className="italic font-light">from?</span>
            </em>
          </h2>

          <input
            type="text"
            placeholder="Bengaluru, Karnataka"
            className="mt-12 w-full border-b-2 border-ink bg-transparent pb-3 font-display text-3xl font-semibold focus:border-coral focus:outline-none"
            defaultValue="Bengaluru, Karnataka"
          />

          <div className="mt-12 flex justify-end">
            <button className="inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-display text-lg font-semibold text-cream transition hover:bg-ink-soft">
              Next
              <span className="grid size-7 place-items-center rounded-full bg-lime text-ink">
                →
              </span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

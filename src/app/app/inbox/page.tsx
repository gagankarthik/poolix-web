import { TopBar } from "@/components/app/TopBar";

const threads = [
  {
    other: "Aanya Iyer",
    hue: 142,
    last: "Sure, see you at 5:50 AM at the Forum Mall stop.",
    when: "2m",
    unread: 0,
    verified: true,
  },
  {
    other: "Rohan Sharma",
    hue: 28,
    last: "Hey, can you push the pickup by 10 min?",
    when: "1h",
    unread: 2,
    verified: true,
  },
  {
    other: "Priya Reddy",
    hue: 305,
    last: "Confirmed — looking forward to it!",
    when: "Yesterday",
    unread: 0,
    verified: true,
  },
];

export default function InboxPage() {
  return (
    <>
      <TopBar eyebrow="· Conversations" title="Inbox" />

      <div className="grid flex-1 grid-cols-[24rem_1fr]">
        {/* Thread list */}
        <ul className="border-r border-line scroll-elegant overflow-y-auto">
          {threads.map((t, i) => (
            <li
              key={t.other}
              className={`flex items-start gap-4 border-b border-line/60 px-6 py-5 transition hover:bg-cream-soft ${
                i === 0 ? "bg-cream-soft" : ""
              }`}
            >
              <div className="relative">
                <div
                  className="grid size-12 place-items-center rounded-full font-display text-lg font-semibold text-ink"
                  style={{ background: `hsl(${t.hue} 60% 75%)` }}
                >
                  {t.other.charAt(0)}
                </div>
                {t.verified && (
                  <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-lime text-[10px] font-bold text-ink ring-2 ring-paper">
                    ✓
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate font-display text-base font-semibold">
                    {t.other}
                  </span>
                  <span className="font-mono text-[10px] text-ink-muted">
                    {t.when}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`truncate text-sm ${
                      t.unread > 0 ? "text-ink font-medium" : "text-ink-soft"
                    }`}
                  >
                    {t.last}
                  </span>
                  {t.unread > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1.5 font-mono text-[10px] font-bold text-cream">
                      {t.unread}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Open thread */}
        <section className="flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-line bg-paper/60 px-8 py-4">
            <div
              className="grid size-12 place-items-center rounded-full font-display text-lg font-semibold text-ink"
              style={{ background: `hsl(142 60% 75%)` }}
            >
              A
            </div>
            <div>
              <div className="font-display text-lg font-semibold">
                Aanya Iyer
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Active conversation
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 px-8 py-8 scroll-elegant">
            <Bubble side="them" text="Hey! Just confirming the 6:00 AM pickup." />
            <Bubble side="them" text="I'll be in the white Swift Dzire — KA 03 BB 1234." last />
            <Bubble side="me" text="Perfect, see you there." />
            <Bubble
              side="me"
              text="Should I bring anything for the drive? Snacks, music?"
              last
              time="08:24"
            />
            <Bubble
              side="them"
              text="Sure, see you at 5:50 AM at the Forum Mall stop."
              last
              time="08:25"
            />
          </div>

          {/* Composer */}
          <div className="border-t border-line bg-paper px-8 py-5">
            <div className="flex items-center gap-3 rounded-2xl bg-cream-soft px-5 py-3">
              <input
                type="text"
                placeholder="Type a message…"
                className="flex-1 bg-transparent font-medium placeholder:text-ink-muted focus:outline-none"
              />
              <button className="grid size-10 place-items-center rounded-full bg-ink text-cream transition hover:bg-coral">
                →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Bubble({
  side,
  text,
  last,
  time,
}: {
  side: "me" | "them";
  text: string;
  last?: boolean;
  time?: string;
}) {
  return (
    <div className={`flex flex-col ${side === "me" ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-2.5 ${
          side === "me"
            ? "bg-ink text-cream"
            : "border border-line bg-paper text-ink"
        }`}
      >
        {text}
      </div>
      {last && time && (
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          {time}
        </span>
      )}
    </div>
  );
}

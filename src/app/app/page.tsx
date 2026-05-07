import { TopBar } from "@/components/app/TopBar";
import { RideCard } from "@/components/app/RideCard";
import { upcomingRides, myBookings, myProfile } from "@/lib/mock";
import { ArrowUpRight, Star, TrendingUp, IndianRupee } from "lucide-react";

const stats = [
  { label: "Earnings (this month)", value: "₹4,250", trend: "+18%", icon: IndianRupee, accent: "lime" },
  { label: "Trips completed", value: "17", trend: "+3", icon: TrendingUp, accent: "ink" },
  { label: "Average rating", value: "4.85", trend: "★", icon: Star, accent: "amber" },
];

export default function DashboardPage() {
  return (
    <>
      <TopBar
        eyebrow={`Good evening, ${myProfile.name.split(" ")[0]}`}
        title="Dashboard"
      />

      <div className="flex-1 space-y-12 px-10 py-10 scroll-elegant">
        {/* Stat row */}
        <section className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-line bg-paper p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                    {s.label}
                  </div>
                  <div className="mt-3 font-display text-4xl font-bold tracking-tight">
                    {s.value}
                  </div>
                </div>
                <div
                  className={`grid size-10 place-items-center rounded-xl ${
                    s.accent === "lime"
                      ? "bg-lime text-ink"
                      : s.accent === "amber"
                      ? "bg-amber text-ink"
                      : "bg-ink text-cream"
                  }`}
                >
                  <s.icon className="size-4" strokeWidth={2} />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                <ArrowUpRight className="size-3" strokeWidth={2} />
                {s.trend} vs last month
              </div>
            </div>
          ))}
        </section>

        {/* Upcoming rides */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                · Headed your way
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                Rides leaving soon
              </h2>
            </div>
            <a
              href="/app/search"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink"
            >
              See all <ArrowUpRight className="size-3" strokeWidth={2} />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {upcomingRides.slice(0, 4).map((r) => (
              <RideCard key={r.id} ride={r} />
            ))}
          </div>
        </section>

        {/* My bookings preview */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                · Recent activity
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                My bookings
              </h2>
            </div>
            <a
              href="/app/bookings"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink"
            >
              All bookings <ArrowUpRight className="size-3" strokeWidth={2} />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-paper">
            <table className="w-full text-sm">
              <thead className="bg-cream-soft">
                <tr className="text-left">
                  {["Route", "Driver", "Seats", "Total", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {myBookings.map((b) => (
                  <tr key={b.id} className="transition hover:bg-cream-soft/40">
                    <td className="px-5 py-4">
                      <div className="font-display font-semibold">
                        {b.ride.from} <span className="text-ink-muted">→</span>{" "}
                        {b.ride.to}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                        {new Date(b.ride.departsAt).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {b.ride.driver.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {b.seats} seat{b.seats > 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-4 font-display font-semibold">
                      ₹{b.ride.pricePerSeat * b.seats}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: "pending" | "confirmed" | "completed" | "cancelled" }) {
  const map = {
    pending: { bg: "bg-amber/30", text: "text-ink", label: "Pending" },
    confirmed: { bg: "bg-lime", text: "text-ink", label: "Confirmed" },
    completed: { bg: "bg-cream-soft", text: "text-ink-soft", label: "Completed" },
    cancelled: { bg: "bg-coral/20", text: "text-coral", label: "Cancelled" },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${m.bg} ${m.text}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-60" />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
        {m.label}
      </span>
    </span>
  );
}

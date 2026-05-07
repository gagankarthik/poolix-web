import { TopBar } from "@/components/app/TopBar";
import { myBookings } from "@/lib/mock";

export default function BookingsPage() {
  return (
    <>
      <TopBar eyebrow="· Your trips" title="My bookings" />
      <div className="px-10 py-10 space-y-6">
        {myBookings.map((b) => (
          <article
            key={b.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-2xl border border-line bg-paper p-6"
          >
            <div
              className="grid size-12 place-items-center rounded-full font-display text-xl font-semibold text-ink"
              style={{ background: `hsl(${b.ride.driver.avatarHue} 60% 75%)` }}
            >
              {b.ride.driver.name.charAt(0)}
            </div>
            <div>
              <div className="font-display text-2xl font-semibold leading-tight">
                {b.ride.from} <span className="text-ink-muted">→</span>{" "}
                {b.ride.to}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                {new Date(b.ride.departsAt).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {" · "}
                {b.seats} seat{b.seats > 1 ? "s" : ""} · ₹
                {b.ride.pricePerSeat * b.seats}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${
                  b.status === "confirmed"
                    ? "bg-lime text-ink"
                    : b.status === "pending"
                    ? "bg-amber/30 text-ink"
                    : b.status === "completed"
                    ? "bg-cream-soft text-ink-soft"
                    : "bg-coral/20 text-coral"
                }`}
              >
                {b.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

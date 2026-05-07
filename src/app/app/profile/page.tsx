import { TopBar } from "@/components/app/TopBar";
import { myProfile } from "@/lib/mock";
import {
  Phone,
  Mail,
  IdCard,
  FileBadge2,
  Star,
  Edit2,
  Car,
} from "lucide-react";

export default function ProfilePage() {
  const verifications = [
    { key: "phone", label: "Phone number", sub: myProfile.phone, icon: Phone, ok: myProfile.verifications.phone, okCopy: "Verified via OTP" },
    { key: "email", label: "Email", sub: myProfile.email, icon: Mail, ok: myProfile.verifications.email, okCopy: "On file" },
    { key: "govId", label: "Government ID", sub: "Aadhaar last 4 · 2024", icon: IdCard, ok: myProfile.verifications.govId, okCopy: "Submitted" },
    { key: "license", label: "Driving licence", sub: "Required to publish rides", icon: FileBadge2, ok: myProfile.verifications.license, okCopy: "Submitted" },
  ];

  const filled = Math.round(myProfile.rating);

  return (
    <>
      <TopBar eyebrow="· You" title="Profile" />

      <div className="flex-1 px-10 py-10 scroll-elegant">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Hero card */}
          <section className="relative overflow-hidden rounded-3xl border border-line bg-paper p-10 lg:col-span-2">
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-lime/35 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-coral/15 blur-3xl" />

            <div className="relative flex items-start gap-8">
              <div className="relative">
                <div
                  className="grid size-32 place-items-center rounded-full font-display text-5xl font-bold text-ink ring-4 ring-lime ring-offset-4 ring-offset-paper"
                  style={{
                    background: `hsl(${myProfile.avatarHue} 50% 75%)`,
                  }}
                >
                  {myProfile.name.charAt(0)}
                </div>
                <span className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-lime text-ink ring-4 ring-paper">
                  ✓
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-5xl font-bold tracking-tight">
                    {myProfile.name}
                  </h2>
                  <button className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition hover:border-ink hover:text-ink">
                    <Edit2 className="size-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                  Member since 2026 · {myProfile.tripsAsDriver} trips driven · {myProfile.tripsAsRider} rides taken
                </div>

                <p className="mt-4 max-w-md text-ink-soft">{myProfile.bio}</p>

                {/* Big rating block */}
                <div className="mt-8 flex items-end gap-6">
                  <div>
                    <div className="font-display text-6xl font-bold leading-none tracking-tight">
                      {myProfile.rating.toFixed(1)}
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i <= filled
                              ? "fill-amber text-amber"
                              : "fill-line text-line"
                          }`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Based on
                    </div>
                    <div className="font-display text-xl font-semibold">
                      {myProfile.ratingCount} reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle */}
          {myProfile.vehicle && (
            <section className="rounded-3xl border border-line bg-paper p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                · Vehicle on file
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-cream-soft">
                  <Car className="size-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-xl font-semibold leading-tight">
                    {myProfile.vehicle.model}
                  </div>
                  <div className="text-sm text-ink-soft">
                    {myProfile.vehicle.color}
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-dashed border-line bg-cream-soft px-4 py-3 font-mono text-sm tracking-wider text-ink">
                {myProfile.vehicle.plate}
              </div>
              <button className="mt-6 w-full rounded-xl border border-ink/15 bg-cream-soft py-2.5 text-sm font-medium text-ink-soft transition hover:border-ink/40">
                Manage vehicles →
              </button>
            </section>
          )}
        </div>

        {/* Verifications */}
        <section className="mt-10">
          <div className="mb-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              · Trust signals
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
              Verifications
            </h2>
            <p className="mt-1 max-w-xl text-ink-soft">
              Passengers see these on your profile before they tap book.
              Complete all four to unlock publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {verifications.map((v) => (
              <article
                key={v.key}
                className="flex items-center gap-4 bg-paper p-6 transition hover:bg-cream-soft"
              >
                <div
                  className={`grid size-12 place-items-center rounded-2xl ${
                    v.ok ? "bg-lime text-ink" : "bg-cream-soft text-ink-muted"
                  }`}
                >
                  <v.icon className="size-5" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      {v.label}
                    </h3>
                    {v.ok && (
                      <span className="rounded-full bg-lime/30 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                        ✓ {v.okCopy}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    {v.sub}
                  </div>
                </div>
                {!v.ok && (
                  <button className="rounded-full bg-coral px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:bg-coral/90">
                    Add
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

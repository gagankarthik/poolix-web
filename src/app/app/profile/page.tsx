"use client";

import { TopBar } from "@/components/app/TopBar";
import { useAuth } from "@/lib/auth-context";
import { useMyProfile, useRatingsReceived } from "@/lib/queries";
import {
  Phone,
  Mail,
  IdCard,
  FileBadge2,
  Star,
  Edit2,
  Car,
} from "lucide-react";

function hueFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile } = useMyProfile();
  const { avg, count, ratings } = useRatingsReceived(user?.uid);

  const name = profile?.name || user?.displayName || "Rider";
  const initial = name.charAt(0).toUpperCase();
  const hue = user ? hueFromId(user.uid) : 88;
  const photo = profile?.profilePhoto || user?.photoURL || "";

  const verifications = [
    {
      key: "phone",
      label: "Phone number",
      sub: profile?.phone || user?.phoneNumber || "Not added yet",
      icon: Phone,
      ok: !!(profile?.phoneVerified || user?.phoneNumber),
      okCopy: "Verified via OTP",
    },
    {
      key: "email",
      label: "Email",
      sub: profile?.email || user?.email || "Not added yet",
      icon: Mail,
      ok: !!(profile?.email || user?.email),
      okCopy: "On file",
    },
    {
      key: "govId",
      label: "Government ID",
      sub: profile?.aadhaarNumber
        ? `Aadhaar ending ${profile.aadhaarNumber.slice(-4)}`
        : profile?.idDocumentUrl
        ? "Uploaded"
        : "Required to publish rides",
      icon: IdCard,
      ok: !!(profile?.idDocumentUrl || profile?.aadhaarNumber),
      okCopy: "Submitted",
    },
    {
      key: "license",
      label: "Driving licence",
      sub: profile?.licenseDocumentUrl
        ? "Uploaded"
        : "Required to publish rides",
      icon: FileBadge2,
      ok: !!profile?.licenseDocumentUrl,
      okCopy: "Submitted",
    },
  ];

  const filled = Math.round(avg);

  const vehicle =
    profile?.vehicleModel || profile?.vehicleType
      ? {
          model: profile.vehicleModel || profile.vehicleType || "",
          color: profile.vehicleColor || "",
          plate: profile.vehicleRcNumber || "",
        }
      : null;

  return (
    <>
      <TopBar eyebrow="· You" title="Profile" />

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10 scroll-elegant">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="relative overflow-hidden rounded-3xl border border-line bg-paper p-6 sm:p-10 lg:col-span-2">
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-lime/35 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-coral/15 blur-3xl" />

            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
              <div className="relative">
                <div
                  className="grid size-32 place-items-center overflow-hidden rounded-full font-display text-5xl font-bold text-ink ring-4 ring-lime ring-offset-4 ring-offset-paper"
                  style={{ background: `hsl(${hue} 50% 75%)` }}
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={name} className="size-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                {profile?.verificationStatus === "verified" && (
                  <span className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-lime text-ink ring-4 ring-paper">
                    ✓
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-5xl font-bold tracking-tight">
                    {name}
                  </h2>
                  <button
                    aria-label="Edit name"
                    className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition hover:border-ink hover:text-ink"
                  >
                    <Edit2 className="size-4" strokeWidth={1.75} />
                  </button>
                </div>

                <div className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                  {profile?.createdAt
                    ? `Member since ${profile.createdAt.toDate().getFullYear()}`
                    : "Member · Poolix"}
                  {" · "}
                  {ratings.length} review{ratings.length === 1 ? "" : "s"}
                </div>

                {profile?.bio && (
                  <p className="mt-4 max-w-md text-ink-soft">{profile.bio}</p>
                )}

                <div className="mt-8 flex items-end gap-6">
                  <div>
                    <div className="font-display text-6xl font-bold leading-none tracking-tight">
                      {count > 0 ? avg.toFixed(1) : "—"}
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
                      {count} review{count === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {vehicle && (
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
                    {vehicle.model}
                  </div>
                  {vehicle.color && (
                    <div className="text-sm text-ink-soft">{vehicle.color}</div>
                  )}
                </div>
              </div>
              {vehicle.plate && (
                <div className="mt-6 rounded-xl border border-dashed border-line bg-cream-soft px-4 py-3 font-mono text-sm tracking-wider text-ink">
                  {vehicle.plate}
                </div>
              )}
            </section>
          )}
        </div>

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

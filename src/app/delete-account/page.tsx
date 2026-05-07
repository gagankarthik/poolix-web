"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/landing/Footer";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const REASONS = [
  "I don't use the app anymore",
  "I have privacy concerns",
  "I created the account by accident",
  "I'm moving to another service",
  "Other",
] as const;

const SCOPES = [
  {
    id: "all",
    label: "Delete everything",
    body:
      "Account, profile, ratings, chats, and your trip history. Aadhaar / licence images are erased within 30 days. Tax-relevant trip records (driver-side) are kept 7 years per Indian regulation.",
  },
  {
    id: "verification",
    label: "Delete verification documents only",
    body:
      "We remove your government ID + driving licence images. Your account stays active but you can't publish rides until you re-verify.",
  },
] as const;

export default function DeleteAccountPage() {
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<(typeof REASONS)[number]>(REASONS[0]);
  const [scope, setScope] =
    useState<(typeof SCOPES)[number]["id"]>("all");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready =
    phone.replace(/\D/g, "").length >= 10 && confirm.trim().toLowerCase() === "delete";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, "deletion_requests"), {
        phone: phone.replace(/\s+/g, ""),
        email: email.trim() || null,
        reason,
        scope,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        submittedAt: serverTimestamp(),
        status: "received",
      });
      setSubmitted(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't submit your request. Please email privacy@poolix.app instead."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grain min-h-screen">
      <header className="border-b border-line/60 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:gap-6 sm:text-xs">
            <Link href="/privacy" className="transition hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-ink">
              Terms
            </Link>
            <Link href="/" className="transition hover:text-ink">
              ← Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        {!submitted ? (
          <>
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
              · Account deletion request
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
              Delete your
              <br />
              <span className="italic font-light">Poolix account.</span>
            </h1>
            <p className="mt-8 max-w-xl text-ink-soft">
              The easiest way to delete your account is in the app — open
              Poolix → Account → <strong>Close my account</strong>. If you
              can&apos;t access the app, fill out this form and we&apos;ll
              process the request within 7 working days.
            </p>

            {/* What happens callout */}
            <div className="mt-10 rounded-3xl border border-ink/10 bg-paper p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                · What happens after you submit
              </div>
              <ol className="mt-4 space-y-3 text-sm text-ink-soft">
                <li className="flex gap-3">
                  <span className="font-mono font-semibold text-ink">01</span>
                  We email you within 24 hours to confirm the request came from you.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono font-semibold text-ink">02</span>
                  We pause your account immediately so no new bookings can be made.
                </li>
                <li className="flex gap-3">
                  <span className="font-mono font-semibold text-ink">03</span>
                  Your data is deleted within 30 days. Trip records required by Indian tax law are retained for 7 years (anonymised after deletion).
                </li>
              </ol>
            </div>

            <form onSubmit={submit} className="mt-12 space-y-8">
              {/* Phone */}
              <Field
                label="Phone number used to sign up"
                hint="Same number you used for OTP verification."
              >
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 font-display text-xl font-semibold focus:border-ink focus:outline-none"
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                hint="Used to confirm the request and send you the deletion confirmation."
                optional
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 font-display text-xl focus:border-ink focus:outline-none"
                  placeholder="you@example.com"
                />
              </Field>

              {/* Scope */}
              <Field label="What should we delete?">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SCOPES.map((s) => (
                    <label
                      key={s.id}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        scope === s.id
                          ? "border-ink bg-cream-soft"
                          : "border-line bg-paper hover:border-ink/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="scope"
                        value={s.id}
                        checked={scope === s.id}
                        onChange={() => setScope(s.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-3 rounded-full border-2 border-ink ${
                            scope === s.id ? "bg-lime" : "bg-transparent"
                          }`}
                        />
                        <span className="font-display text-base font-semibold">
                          {s.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-ink-soft">{s.body}</p>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Reason */}
              <Field label="Why are you leaving?" optional>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as typeof reason)}
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 font-display text-lg focus:border-ink focus:outline-none"
                >
                  {REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>

              {/* Confirm */}
              <Field
                label='Type "DELETE" below to confirm'
                hint="Case-insensitive. Helps prevent accidental deletions."
              >
                <input
                  type="text"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="w-full rounded-xl border-2 border-coral/30 bg-paper px-4 py-3 font-mono text-xl font-bold uppercase tracking-[0.4em] text-coral focus:border-coral focus:outline-none"
                />
              </Field>

              {error && (
                <div className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!ready || submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-4 font-display text-lg font-semibold text-cream transition hover:bg-coral/90 disabled:opacity-40 sm:w-auto sm:px-12"
              >
                {submitting ? "Submitting…" : "Request deletion"}
              </button>

              <p className="text-xs text-ink-muted">
                Prefer email? Send your phone number and the word DELETE to{" "}
                <a
                  href="mailto:privacy@poolix.app?subject=Delete%20my%20Poolix%20account"
                  className="underline decoration-coral underline-offset-4"
                >
                  privacy@poolix.app
                </a>
                .
              </p>
            </form>
          </>
        ) : (
          <Submitted />
        )}
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        {label}
        {optional && (
          <span className="rounded-full bg-cream-soft px-2 py-0.5 text-[9px] font-semibold text-ink-soft">
            Optional
          </span>
        )}
      </span>
      <div className="mt-2">{children}</div>
      {hint && (
        <p className="mt-2 text-xs text-ink-muted">{hint}</p>
      )}
    </label>
  );
}

function Submitted() {
  return (
    <div className="text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-lime">
        <span className="font-display text-3xl font-bold text-ink">✓</span>
      </div>
      <h1 className="mt-8 font-display text-5xl font-bold leading-[0.95] tracking-tight">
        Request received.
      </h1>
      <p className="mx-auto mt-6 max-w-md text-ink-soft">
        We&apos;ll email you within 24 hours to verify the request. Your
        account is paused as of now, so no new bookings will go through. If
        you change your mind in the next 24 hours, just reply to that email
        and we&apos;ll cancel the deletion.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-ink-soft"
      >
        Back to home →
      </Link>
    </div>
  );
}

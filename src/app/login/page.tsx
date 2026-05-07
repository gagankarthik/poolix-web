"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { user, loading, signInGoogle, startPhoneSignIn, verifyPhoneCode, cancelPhoneSignIn, phoneStage, phoneError } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/app";

  // Once Firebase resolves a logged-in user, bounce to the requested page.
  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, router, next]);

  const [phone, setPhone] = useState("+91 ");
  const [code, setCode] = useState("");
  const [working, setWorking] = useState(false);
  const recaptchaIdRef = useRef("login-recaptcha");

  async function handleGoogle() {
    setWorking(true);
    try {
      await signInGoogle();
    } finally {
      setWorking(false);
    }
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setWorking(true);
    try {
      await startPhoneSignIn(phone.replace(/\s+/g, ""), recaptchaIdRef.current);
    } catch {
      // error already surfaced via phoneError
    } finally {
      setWorking(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setWorking(true);
    try {
      await verifyPhoneCode(code.trim());
    } catch {
      /* surfaced via phoneError */
    } finally {
      setWorking(false);
    }
  }

  // Brief loader while Firebase decides whether the cached session is valid
  if (loading || (!loading && user)) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-muted">
        <span className="font-mono text-xs uppercase tracking-[0.24em]">
          One moment…
        </span>
      </div>
    );
  }

  return (
    <div className="grain min-h-screen">
      {/* Top bar */}
      <header className="border-b border-line/60 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted transition hover:text-ink"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[80vh] max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-12">
        {/* Editorial left column */}
        <section className="lg:col-span-7">
          <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
            · Sign in
          </div>
          <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
            Welcome
            <br />
            back to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">poolix</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-2 -z-0 h-4 bg-lime"
              />
            </span>
            <span className="text-coral">.</span>
          </h1>

          <p className="mt-8 max-w-md text-lg text-ink-soft">
            Same account, same rides, same conversations as the Android app.
            Sign in with Google for the fastest path, or use your phone if
            that&apos;s how you registered originally.
          </p>

          <ul className="mt-12 space-y-4 text-sm text-ink-soft">
            {[
              "Your bookings and chats sync across devices",
              "OTP-verified phones on every account",
              "Two-tap rebook for routes you take often",
            ].map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime-deep" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Auth card */}
        <section className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-ink/10 bg-paper p-8 shadow-[0_30px_60px_-30px_rgba(10,15,31,0.25)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              Choose a method
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={working}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-ink bg-cream px-5 py-4 font-display text-base font-semibold text-ink transition hover:bg-ink hover:text-cream disabled:opacity-60"
            >
              <GoogleMark />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              <span className="h-px flex-1 bg-line" />
              or with phone
              <span className="h-px flex-1 bg-line" />
            </div>

            {/* Phone */}
            {phoneStage !== "code-sent" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                    Mobile number
                  </span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 90000 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 font-display text-xl font-semibold text-ink focus:border-ink focus:outline-none"
                  />
                </label>
                {phoneError && (
                  <p className="text-sm text-coral">{phoneError}</p>
                )}
                <button
                  type="submit"
                  disabled={working}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-medium text-cream transition hover:bg-ink-soft disabled:opacity-60"
                >
                  {working ? "Sending…" : "Send OTP"}
                </button>
                {/* Invisible reCAPTCHA mount target */}
                <div id={recaptchaIdRef.current} />
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="rounded-xl border border-dashed border-line bg-cream-soft px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
                  Code sent to <span className="text-ink">{phone}</span>
                </div>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                    6-digit code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/[^\d]/g, ""))
                    }
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-center font-mono text-3xl font-semibold tracking-[0.5em] text-ink focus:border-ink focus:outline-none"
                  />
                </label>
                {phoneError && (
                  <p className="text-sm text-coral">{phoneError}</p>
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={cancelPhoneSignIn}
                    className="flex-1 rounded-2xl border border-line bg-cream-soft py-3.5 text-sm font-medium text-ink-soft transition hover:border-ink/40"
                  >
                    Change number
                  </button>
                  <button
                    type="submit"
                    disabled={code.length < 6 || working}
                    className="flex-1 rounded-2xl bg-ink py-3.5 text-sm font-medium text-cream transition hover:bg-ink-soft disabled:opacity-50"
                  >
                    {working ? "Verifying…" : "Verify"}
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-ink-muted">
              By signing in you agree to our{" "}
              <Link href="/privacy" className="underline decoration-coral underline-offset-4">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-7.8z"
      />
      <path
        fill="#34A853"
        d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.3 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8C4.1 20.7 7.8 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.9 14.2c-.3-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H2.2C1.4 8.5 1 10.2 1 12s.4 3.5 1.2 5l3.7-2.8z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.5 2.1 15 1 12 1 7.8 1 4.1 3.3 2.2 7l3.7 2.8C6.8 7.3 9.2 5.4 12 5.4z"
      />
    </svg>
  );
}

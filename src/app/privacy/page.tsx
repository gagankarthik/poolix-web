import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy — Poolix",
  description: "How Poolix collects, uses, and protects your information.",
};

const sections = [
  {
    id: "summary",
    title: "01 — In one paragraph",
    body: (
      <>
        Poolix collects the information needed to run a carpooling service and
        nothing more. Your phone number, email, and government ID are stored
        encrypted on Indian Firebase servers; your live location is read only
        while you have the app open and is never sold; ratings and reviews are
        public so passengers can choose drivers safely. We don&apos;t sell your
        data, and you can delete your account from inside the app at any time.
      </>
    ),
  },
  {
    id: "collect",
    title: "02 — What we collect",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>
          <strong>Account data:</strong> name, mobile number (OTP-verified),
          email, profile photo, and the ratings + reviews you receive from
          other users.
        </li>
        <li>
          <strong>Verification documents:</strong> for drivers — government ID
          (Aadhaar/PAN) and driving licence images. Stored encrypted at rest;
          accessed only by Poolix support during disputes.
        </li>
        <li>
          <strong>Trip data:</strong> origin, destination, time, route, fare
          per seat, vehicle details, and per-passenger pickup/payment status.
        </li>
        <li>
          <strong>Device data:</strong> FCM token (so we can send notifications),
          app version, OS version, and Android language. No advertising IDs.
        </li>
        <li>
          <strong>Location:</strong> read while the app is in the foreground to
          show nearby rides and during a trip to update the driver&apos;s
          position. Never collected in the background.
        </li>
      </ul>
    ),
  },
  {
    id: "use",
    title: "03 — How we use it",
    body: (
      <>
        We use your data to (a) match drivers with passengers, (b) verify
        identity before a ride is published, (c) deliver in-app notifications
        for booking requests, approvals, and ride status, (d) compute earnings
        and ratings, and (e) respond to safety reports filed by either side.
        We do not sell or rent your personal data to third parties.
      </>
    ),
  },
  {
    id: "share",
    title: "04 — Who we share it with",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>
          <strong>The other party in your trip:</strong> drivers see passenger
          name, photo, and rating; passengers see the same plus the
          driver&apos;s vehicle and verifications.
        </li>
        <li>
          <strong>Firebase / Google Cloud:</strong> our hosting provider for
          authentication, database (Firestore), and push notifications. Data
          stays in the asia-south1 region.
        </li>
        <li>
          <strong>Law enforcement:</strong> only when compelled by a valid
          legal request under Indian law.
        </li>
      </ul>
    ),
  },
  {
    id: "retain",
    title: "05 — How long we keep it",
    body: (
      <>
        Active accounts: indefinitely while you continue to use Poolix. Closed
        accounts: most data deleted within 30 days; tax-relevant trip records
        retained for 7 years per Indian regulation. Your verification documents
        are deleted within 30 days of account closure unless retained for an
        active dispute.
      </>
    ),
  },
  {
    id: "rights",
    title: "06 — Your rights",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>
          Access, correct, or delete your account from{" "}
          <Link href="/app/profile" className="underline decoration-coral underline-offset-4">
            the profile screen
          </Link>{" "}
          → Close account.
        </li>
        <li>Request a copy of your data by emailing privacy@poolix.app.</li>
        <li>Withdraw location consent any time via Android system settings.</li>
        <li>
          Lodge a complaint with India&apos;s Data Protection Board if you
          believe we&apos;ve mishandled your data.
        </li>
      </ul>
    ),
  },
  {
    id: "permissions",
    title: "07 — Why each permission",
    body: (
      <div className="overflow-hidden rounded-2xl border border-ink/10">
        <table className="w-full text-sm">
          <thead className="bg-cream-soft">
            <tr className="text-left">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Permission
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {[
              ["Location (foreground)", "Show rides near you; track active ride for passengers"],
              ["Notifications", "Booking requests, approvals, ride start/complete reminders"],
              ["Photos / Media", "Pick a profile photo and verification documents"],
              ["Internet", "Talk to Firebase backend"],
              ["Receive boot completed", "Re-schedule ride reminders after device reboot"],
            ].map(([p, w]) => (
              <tr key={p} className="bg-paper">
                <td className="px-4 py-3 font-mono text-xs text-ink">{p}</td>
                <td className="px-4 py-3 text-ink-soft">{w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: "grievance",
    title: "08 — Grievance officer",
    body: (
      <>
        Per India&apos;s IT Rules, 2021, we&apos;ve appointed a Grievance
        Officer. Email{" "}
        <a
          href="mailto:grievance@poolix.app"
          className="underline decoration-coral underline-offset-4"
        >
          grievance@poolix.app
        </a>{" "}
        with any complaint about how your data has been handled. We acknowledge
        within 24 hours and resolve within 15 days.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="grain min-h-screen">
      {/* Compact nav */}
      <header className="border-b border-line/60 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12">
        {/* Sticky table of contents */}
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
          {/* Hero */}
          <div className="border-b border-line/60 pb-12">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
              · Last updated: 7 May 2026
            </div>
            <h1 className="mt-4 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
              Privacy
              <br />
              <span className="italic font-light">policy.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-ink-soft">
              The short version is at the top. The detailed version is below
              it. This document is governed by India&apos;s Information
              Technology Act, 2000 and the SPDI Rules, 2011.
            </p>
          </div>

          {/* Sections */}
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

          <div className="mt-24 border-t border-line/60 pt-8 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            Made with care in Bengaluru, India · Governed by Indian law
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

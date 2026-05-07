import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Terms & Conditions — Poolix",
  description:
    "The agreement between you and Poolix when using our carpooling service.",
};

const sections = [
  {
    id: "intro",
    title: "01 — The agreement",
    body: (
      <>
        These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to
        and use of the Poolix mobile and web applications (&ldquo;Poolix&rdquo;,
        &ldquo;the App&rdquo;), operated by Poolix India (&ldquo;Company&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;). By signing in, you agree to be
        bound by these Terms and our{" "}
        <Link
          href="/privacy"
          className="underline decoration-coral underline-offset-4"
        >
          Privacy Policy
        </Link>
        . If you don&apos;t agree, please uninstall the app and stop using the
        service. These Terms form a legally binding agreement under the Indian
        Contract Act, 1872 and the Information Technology Act, 2000.
      </>
    ),
  },
  {
    id: "definitions",
    title: "02 — Definitions",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li><strong>User</strong> — anyone who accesses Poolix as a Rider or Driver.</li>
        <li><strong>Rider</strong> — a User who books a seat in someone else&apos;s ride.</li>
        <li><strong>Driver</strong> — a verified User who offers seats in their personal vehicle.</li>
        <li><strong>Ride</strong> — a carpool trip published by a Driver for a specific route, date, and price.</li>
        <li><strong>Booking</strong> — a confirmed reservation of one or more seats in a Ride.</li>
      </ul>
    ),
  },
  {
    id: "eligibility",
    title: "03 — Eligibility",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>You must be at least 18 years old.</li>
        <li>You must be a citizen or legal resident of India with a valid Indian mobile number for OTP.</li>
        <li>
          To publish rides as a Driver, you must hold a valid driving licence
          under the Motor Vehicles Act, 1988 and own or have legal right to
          operate the vehicle you list.
        </li>
        <li>You must not be barred from using Poolix under applicable law or a previous Company decision.</li>
      </ul>
    ),
  },
  {
    id: "nature",
    title: "04 — Carpooling, not a taxi service",
    body: (
      <>
        Poolix is a technology platform that introduces Drivers to Riders
        travelling the same route. It is <em>not</em> a taxi service, transport
        operator, or aggregator. All rides are private cost-sharing
        arrangements under Section 2(7) of the Motor Vehicles Act, 1988. Per-seat
        prices may not exceed the proportionate running cost of the journey.
        The Company acts solely as an intermediary under the IT (Intermediary
        Guidelines and Digital Media Ethics Code) Rules, 2021 and is not
        responsible for the conduct of Drivers or Riders.
      </>
    ),
  },
  {
    id: "driver",
    title: "05 — Driver obligations",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>Maintain a valid driving licence, RC, motor insurance, and PUC at all times.</li>
        <li>Keep your vehicle roadworthy and in safe operating condition.</li>
        <li>Comply with all traffic laws and Central / State government regulations.</li>
        <li>Never exceed the seating capacity stated on your RC.</li>
        <li>Don&apos;t consume alcohol, drugs, or any intoxicant before or during a ride.</li>
        <li>Don&apos;t use a mobile phone while driving.</li>
        <li>Offer rides only on the route, date, and time you listed.</li>
        <li>Price rides on a genuine cost-sharing basis — not for commercial gain.</li>
        <li>Submit accurate verification documents and update them when they change or expire.</li>
      </ul>
    ),
  },
  {
    id: "rider",
    title: "06 — Rider obligations",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>Arrive at the pickup point at least 5 minutes before departure.</li>
        <li>Treat the Driver&apos;s vehicle with care; don&apos;t cause damage.</li>
        <li>Don&apos;t carry weapons, flammables, narcotics, or any unlawful item.</li>
        <li>Behave respectfully toward the Driver and co-passengers.</li>
        <li>Wear a seatbelt for the entire journey.</li>
        <li>Don&apos;t pressure the Driver to deviate from the listed route or break traffic rules.</li>
      </ul>
    ),
  },
  {
    id: "payments",
    title: "07 — Payments and cancellations",
    body: (
      <>
        <p>
          Poolix is currently a cash-on-arrival service. You hand the Driver
          the listed fare at pickup; the Driver marks payment received in the
          app. If we add online payments, those will be processed by an
          RBI-licensed payment gateway and Razorpay&apos;s terms will additionally
          apply.
        </p>
        <p className="mt-4 font-semibold">Cancellation policy</p>
        <ul className="mt-2 list-disc space-y-3 pl-5">
          <li>
            Driver cancels a confirmed booking → no fee owed by the rider, and
            we may temporarily suspend the Driver after repeated cancellations.
          </li>
          <li>Rider cancels &gt; 24 hours before departure → no fee.</li>
          <li>Rider cancels within 24 hours → cancellation fee up to 20% of fare may apply.</li>
          <li>No-shows by the Rider are non-refundable.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content",
    title: "08 — User content and ratings",
    body: (
      <>
        Ratings, reviews, profile photos, and any other content you submit
        (&ldquo;User Content&rdquo;) must be truthful and not violate any
        third-party rights. By submitting content you grant Poolix a worldwide,
        non-exclusive, royalty-free licence to display and distribute it within
        the service. We may remove User Content that violates these Terms or
        applicable law. Fake or malicious reviews can result in account
        suspension.
      </>
    ),
  },
  {
    id: "prohibited",
    title: "09 — Prohibited conduct",
    body: (
      <ul className="list-disc space-y-3 pl-5">
        <li>Using Poolix for any unlawful purpose.</li>
        <li>Impersonating another person or creating multiple accounts.</li>
        <li>Posting obscene, defamatory, or harassing content.</li>
        <li>Using bots or scrapers to access the service.</li>
        <li>Attempting to gain unauthorised access to Poolix systems.</li>
        <li>Manipulating ratings, prices, or any other metric.</li>
        <li>Operating a commercial transport service through the platform.</li>
        <li>Discriminating against any User on grounds prohibited under the Constitution of India.</li>
      </ul>
    ),
  },
  {
    id: "liability",
    title: "10 — Disclaimer and limitation of liability",
    body: (
      <>
        Poolix is provided &ldquo;as is&rdquo;, without warranties of any kind.
        We don&apos;t guarantee the accuracy, safety, or legality of any ride;
        we make best-effort verification of Drivers but ultimately the people
        in the car are responsible for their own conduct. To the maximum
        extent permitted by Indian law, the Company&apos;s aggregate liability
        to you shall not exceed the total fees you paid through the platform
        in the three months preceding the event giving rise to a claim.
        Nothing in these Terms excludes liability for fraud, wilful misconduct,
        or death/personal injury caused by our negligence.
      </>
    ),
  },
  {
    id: "termination",
    title: "11 — Termination",
    body: (
      <>
        You may close your account at any time from the Profile screen or via
        our{" "}
        <Link
          href="/delete-account"
          className="underline decoration-coral underline-offset-4"
        >
          deletion form
        </Link>
        . We may suspend or terminate your account, with or without notice,
        if we determine that you have violated these Terms or pose a risk to
        other users. Provisions that by their nature should survive termination
        (Sections 07, 08, 10, 12, 13) continue to apply.
      </>
    ),
  },
  {
    id: "jurisdiction",
    title: "12 — Governing law and disputes",
    body: (
      <>
        These Terms are governed by the laws of India. Any dispute will first
        be attempted via good-faith negotiation. Unresolved disputes go to
        binding arbitration under the Arbitration and Conciliation Act, 1996,
        seated in Bengaluru, in English, before a sole arbitrator. Either party
        may seek interim relief from a court; otherwise the courts of Bengaluru,
        Karnataka have exclusive jurisdiction.
      </>
    ),
  },
  {
    id: "changes",
    title: "13 — Changes to these Terms",
    body: (
      <>
        We may update these Terms from time to time. Material changes will be
        notified in the app at least 7 days before they take effect. Your
        continued use after that 7-day window means you accept the updated
        Terms. If you don&apos;t agree to the update, please discontinue use.
      </>
    ),
  },
  {
    id: "contact",
    title: "14 — Contact",
    body: (
      <>
        Questions about these Terms? Email{" "}
        <a
          href="mailto:legal@poolix.app"
          className="underline decoration-coral underline-offset-4"
        >
          legal@poolix.app
        </a>
        . Grievances about how your data is handled should go to{" "}
        <a
          href="mailto:grievance@poolix.app"
          className="underline decoration-coral underline-offset-4"
        >
          grievance@poolix.app
        </a>{" "}
        per our{" "}
        <Link
          href="/privacy#grievance"
          className="underline decoration-coral underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      meta="Terms &amp; conditions · Last updated 7 May 2026"
      titleLeft="Terms"
      titleRight="of service."
      intro={
        <>
          The plain version: be honest, drive safely, share the cost. The
          detailed version is below. This document is governed by Indian law.
        </>
      }
      sections={sections}
      closingLine="If you stopped reading at section 04, that's fine. Just remember 05–07."
    />
  );
}

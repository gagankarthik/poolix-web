import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-paper/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 py-16 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-ink-soft">
            Poolix is a carpooling platform connecting drivers with empty seats
            to passengers heading the same way. Built in Bengaluru, India.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
            © {new Date().getFullYear()} Poolix · All rights reserved
          </p>
        </div>

        <FooterCol
          title="Product"
          links={[
            ["Find a ride", "/app"],
            ["Offer a ride", "/app/publish"],
            ["For drivers", "#drivers"],
            ["Trust & safety", "#trust"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About", "#"],
            ["Press", "#"],
            ["Careers", "#"],
            ["Contact", "mailto:hello@poolix.app"],
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            ["Privacy policy", "/privacy"],
            ["Terms of service", "#"],
            ["Cookies", "#"],
            ["Grievance officer", "/privacy#grievance"],
          ]}
        />
      </div>

      {/* Mega-wordmark */}
      <div className="overflow-hidden border-t border-line/60">
        <div
          aria-hidden
          className="pointer-events-none mx-auto max-w-[110rem] py-4 px-6 font-display text-[clamp(8rem,28vw,32rem)] font-bold leading-[0.85] tracking-tighter text-ink/8"
          style={{ color: "color-mix(in srgb, var(--color-ink) 8%, transparent)" }}
        >
          poolix.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div className="lg:col-span-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-ink transition hover:text-coral"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

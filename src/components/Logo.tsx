import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Geometric P-mark — two stacked semicircles forming a route */}
      <svg
        viewBox="0 0 32 32"
        className="size-7"
        aria-hidden
      >
        <circle cx="10" cy="10" r="4" fill="var(--color-ink)" />
        <circle cx="22" cy="22" r="4" fill="var(--color-coral)" />
        <path
          d="M10 10 Q 22 10, 22 22"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      </svg>
      <span className="font-display text-2xl font-bold tracking-tight">
        poolix<span className="text-coral">.</span>
      </span>
    </div>
  );
}

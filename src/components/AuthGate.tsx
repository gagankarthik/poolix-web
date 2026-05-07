"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Wrap an area that requires sign-in. Renders a hold screen while we resolve
 * the auth session, redirects unauthenticated users to /login with a `next`
 * param so we can bring them back where they came from.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-muted">
        <span className="font-mono text-xs uppercase tracking-[0.24em]">
          Checking your session…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}

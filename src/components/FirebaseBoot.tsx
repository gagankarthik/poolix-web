"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase";

/**
 * Mounts once on the client to fire Firebase Analytics. Renders nothing.
 * Doing this in a client component (rather than the root layout directly)
 * keeps the layout server-rendered and avoids leaking `window`-touching code
 * into the SSR pass.
 */
export function FirebaseBoot() {
  useEffect(() => {
    initAnalytics().catch(() => {
      /* analytics is best-effort — never block the UI on it */
    });
  }, []);
  return null;
}

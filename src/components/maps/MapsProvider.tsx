"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import type { ReactNode } from "react";

const KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;

/**
 * Wraps any subtree that needs Google Maps. Loads the Maps JS API exactly
 * once for the whole subtree; child components import `useMap`,
 * `useMapsLibrary`, etc. from `@vis.gl/react-google-maps` and they all
 * share this single loader.
 *
 * If the API key is absent we render the children unchanged — pages still
 * work, they just won't show maps or autocomplete suggestions.
 */
export function MapsProvider({ children }: { children: ReactNode }) {
  if (!KEY) return <>{children}</>;
  return (
    <APIProvider apiKey={KEY} libraries={["places", "marker"]}>
      {children}
    </APIProvider>
  );
}

export function isMapsConfigured() {
  return !!KEY;
}

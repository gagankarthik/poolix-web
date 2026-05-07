"use client";

import { useEffect, useState } from "react";
import {
  AdvancedMarker,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

type LatLng = { lat: number; lng: number };

type Props = {
  origin: LatLng | null;
  destination: LatLng | null;
  className?: string;
  /** When true, disables the white travel-line and just shows pins. */
  pinsOnly?: boolean;
};

/**
 * Shows a route between two pinned points, fetched from the Directions API
 * and rendered as a polyline overlay. Falls back gracefully (no polyline) if
 * Directions can't resolve the path. Auto-fits bounds whenever endpoints
 * change.
 *
 * Wrap a <RouteMap> inside any subtree that's already under <APIProvider>;
 * `MapsProvider` does that for the whole `/app` tree.
 */
export function RouteMap({ origin, destination, className, pinsOnly }: Props) {
  return (
    <div
      className={
        className ??
        "h-72 w-full overflow-hidden rounded-3xl border border-ink/10 bg-paper"
      }
    >
      <Map
        mapId="POOLIX_MAP"
        defaultZoom={5}
        defaultCenter={{ lat: 20.5937, lng: 78.9629 }} // India
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        style={{ width: "100%", height: "100%" }}
      >
        {origin && (
          <AdvancedMarker position={origin}>
            <Pin background="#C8F03C" borderColor="#0A0F1F" glyphColor="#0A0F1F" />
          </AdvancedMarker>
        )}
        {destination && (
          <AdvancedMarker position={destination}>
            <Pin background="#FF5A4A" borderColor="#0A0F1F" glyphColor="#FFF" />
          </AdvancedMarker>
        )}
        {!pinsOnly && origin && destination && (
          <Directions origin={origin} destination={destination} />
        )}
        <FitToEndpoints origin={origin} destination={destination} />
      </Map>
    </div>
  );
}

function Directions({
  origin,
  destination,
}: {
  origin: LatLng;
  destination: LatLng;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [renderer, setRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  // Build the renderer once we have both the map and the routes lib.
  useEffect(() => {
    if (!map || !routesLib) return;
    const r = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#0A0F1F",
        strokeWeight: 4,
        strokeOpacity: 0.85,
      },
    });
    setRenderer(r);
    return () => r.setMap(null);
  }, [map, routesLib]);

  // Recompute the route whenever endpoints change.
  useEffect(() => {
    if (!routesLib || !renderer) return;
    const svc = new routesLib.DirectionsService();
    svc.route(
      {
        origin,
        destination,
        travelMode: routesLib.TravelMode.DRIVING,
      },
      (res, status) => {
        if (status === "OK" && res) renderer.setDirections(res);
      }
    );
  }, [routesLib, renderer, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

function FitToEndpoints({
  origin,
  destination,
}: {
  origin: LatLng | null;
  destination: LatLng | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!map || (!origin && !destination)) return;
    const bounds = new google.maps.LatLngBounds();
    if (origin) bounds.extend(origin);
    if (destination) bounds.extend(destination);
    if (origin && destination) {
      map.fitBounds(bounds, 80);
    } else if (origin || destination) {
      const single = (origin || destination)!;
      map.setCenter(single);
      map.setZoom(11);
    }
  }, [map, origin?.lat, origin?.lng, destination?.lat, destination?.lng]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

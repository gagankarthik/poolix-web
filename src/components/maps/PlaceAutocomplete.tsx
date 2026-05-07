"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

export type PickedPlace = {
  description: string;
  primaryText: string;
  secondaryText: string;
  placeId: string;
  lat?: number;
  lng?: number;
};

type Props = {
  /** Field label, shown as a small uppercase eyebrow above the input. */
  label: string;
  /** Optional icon (defaults to a pin). */
  icon?: React.ReactNode;
  /** Initial / controlled text. */
  value: string;
  /** Called every keystroke with the raw text (for parents that need it). */
  onChangeText: (text: string) => void;
  /** Called with the resolved place when the user picks a suggestion. */
  onPick?: (place: PickedPlace) => void;
  /** Optional placeholder. */
  placeholder?: string;
  /** Bias predictions to a single country (ISO code). Defaults to "in". */
  country?: string;
  className?: string;
};

/**
 * Place autocomplete input. Loads the Places library on demand via
 * @vis.gl/react-google-maps' `useMapsLibrary`, debounces requests by 250 ms,
 * and renders a styled dropdown of predictions inline below the input.
 *
 * Falls back to a plain text input (no suggestions) when the Maps library
 * isn't loaded yet — typing still updates the parent via onChangeText.
 */
export function PlaceAutocomplete({
  label,
  icon,
  value,
  onChangeText,
  onPick,
  placeholder,
  country = "in",
  className,
}: Props) {
  const placesLib = useMapsLibrary("places");
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const fetchAbort = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Build services lazily once the Places lib lands.
  const services = useMemo(() => {
    if (!placesLib) return null;
    sessionToken.current = new placesLib.AutocompleteSessionToken();
    return {
      autocomplete: new placesLib.AutocompleteService(),
      // PlacesService needs a DOM node to render attribution into.
      details: new placesLib.PlacesService(document.createElement("div")),
    };
  }, [placesLib]);

  // Debounced fetch on value change.
  useEffect(() => {
    if (!services) return;
    if (!value || value.trim().length < 2) {
      setPredictions([]);
      setOpen(false);
      return;
    }
    if (fetchAbort.current) window.clearTimeout(fetchAbort.current);
    fetchAbort.current = window.setTimeout(() => {
      services.autocomplete.getPlacePredictions(
        {
          input: value,
          sessionToken: sessionToken.current!,
          componentRestrictions: { country },
          types: ["(cities)"],
        },
        (preds) => {
          setPredictions(preds ?? []);
          setOpen((preds?.length ?? 0) > 0);
          setActiveIdx(-1);
        }
      );
    }, 250);
    return () => {
      if (fetchAbort.current) window.clearTimeout(fetchAbort.current);
    };
  }, [value, services, country]);

  // Close on click-outside.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function pick(p: google.maps.places.AutocompletePrediction) {
    if (!services) return;
    services.details.getDetails(
      {
        placeId: p.place_id,
        fields: ["geometry.location", "name"],
        sessionToken: sessionToken.current!,
      },
      (place, status) => {
        // Reset the session token after a billable detail call (per Places billing rules).
        sessionToken.current = new placesLib!.AutocompleteSessionToken();

        const description = p.description;
        const primary = p.structured_formatting.main_text;
        const secondary = p.structured_formatting.secondary_text ?? "";
        const lat = place?.geometry?.location?.lat();
        const lng = place?.geometry?.location?.lng();
        onChangeText(primary);
        onPick?.({
          description,
          primaryText: primary,
          secondaryText: secondary,
          placeId: p.place_id,
          lat: status === "OK" ? lat : undefined,
          lng: status === "OK" ? lng : undefined,
        });
        setOpen(false);
      }
    );
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % predictions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? predictions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) pick(predictions[activeIdx]);
      else pick(predictions[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label className="flex flex-col gap-1 bg-paper px-5 py-4">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
          {icon ?? <MapPin className="size-4" strokeWidth={1.75} />}
          {label}
        </span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChangeText(e.target.value)}
          onFocus={() => predictions.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          className="bg-transparent font-display text-xl font-semibold text-ink placeholder:text-ink-muted/60 focus:outline-none"
        />
      </label>

      {open && predictions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-line bg-paper shadow-[0_24px_60px_-24px_rgba(10,15,31,0.25)]"
        >
          {predictions.map((p, i) => (
            <li
              key={p.place_id}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                // mousedown so the input doesn't lose focus and close us first
                e.preventDefault();
                pick(p);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={cn(
                "flex cursor-pointer items-start gap-3 border-b border-line/60 px-5 py-3 last:border-b-0",
                i === activeIdx ? "bg-cream-soft" : "bg-paper"
              )}
            >
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-cream-soft">
                <MapPin className="size-3" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-base font-semibold text-ink">
                  {p.structured_formatting.main_text}
                </span>
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {p.structured_formatting.secondary_text ?? p.description}
                </span>
              </span>
            </li>
          ))}
          <li className="bg-cream-soft px-5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
            Powered by Google Places
          </li>
        </ul>
      )}
    </div>
  );
}

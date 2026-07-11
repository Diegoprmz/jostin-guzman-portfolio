"use client";

import type { CSSProperties } from "react";
import type { PointOfInterest } from "@/types/poi";

/**
 * Liquid-glass droplet marking an interactive point. A wrapper handles
 * centering on the (x%, y%) position so the droplet's own hover-scale (from the
 * .poi-droplet class) stays intact. Shows the POI title on hover.
 */
export function PoiDroplet({
  poi,
  active,
  onClick,
}: {
  poi: PointOfInterest;
  active: boolean;
  onClick: () => void;
}) {
  const size: CSSProperties = { width: poi.radius, height: poi.radius };
  const activeGlow: CSSProperties = active
    ? {
        boxShadow:
          "0 0 46px rgba(96,165,250,0.9), inset 0 0 30px rgba(255,255,255,0.25)",
        transform: "scale(1.12)",
      }
    : {};

  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${poi.position.x}%`, top: `${poi.position.y}%` }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={poi.title}
        aria-pressed={active}
        className="poi-droplet group pointer-events-auto"
        style={{ ...size, ...activeGlow }}
      >
        <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap rounded-pill border border-white/10 bg-surface/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          {poi.title}
        </span>
      </button>
    </div>
  );
}

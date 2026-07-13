"use client";

import Image from "next/image";
import type { PointOfInterest, POIType } from "@/types/poi";

const TYPE_LABEL: Record<POIType, string> = {
  material: "Material",
  concept: "Concepto",
  detail: "Detalle",
  structural: "Estructura",
};

/**
 * Floating dark-glass card for a POI (replaces the old full-height sidebar): a
 * centered, frosted card that pops in with a scale+fade, keeping the render
 * visible around it. Backdrop click closes; mounts only while a POI is open.
 */
export function InfoCard({
  poi,
  moodBoard,
  onClose,
}: {
  poi: PointOfInterest | null;
  moodBoard: string;
  onClose: () => void;
}) {
  if (!poi) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-5">
      {/* subtle backdrop — render stays sensed behind */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
        style={{
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          animation: "fade-in 0.3s ease both",
        }}
      />

      {/* glass card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-card border border-white/10 shadow-elevated"
        style={{
          backdropFilter: "blur(30px) saturate(1.1)",
          WebkitBackdropFilter: "blur(30px) saturate(1.1)",
          background: "rgba(255,255,255,0.055)",
          animation: "card-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="flex flex-col p-7">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-poi">
              {TYPE_LABEL[poi.type]}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="-mt-1 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <h2 className="mt-3 text-2xl font-light text-foreground">
            {poi.details.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {poi.details.body}
          </p>

          {poi.moodBoardItems && poi.moodBoardItems.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {poi.moodBoardItems.map((m) => (
                <span
                  key={m}
                  className="rounded-pill border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted"
                >
                  {m}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {(poi.details.images && poi.details.images.length > 0
              ? poi.details.images
              : [moodBoard]
            ).map((src) => (
              <div
                key={src}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-btn border border-white/10"
              >
                <Image src={src} alt="" fill sizes="420px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

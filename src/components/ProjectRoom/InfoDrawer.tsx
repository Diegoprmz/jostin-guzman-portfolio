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
 * Slide-out panel with a POI's details and its mood-board (materials + image).
 * Slides from the right; the backdrop closes it.
 */
export function InfoDrawer({
  poi,
  moodBoard,
  onClose,
}: {
  poi: PointOfInterest | null;
  moodBoard: string;
  onClose: () => void;
}) {
  const open = poi !== null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`glass fixed top-0 right-0 z-40 flex h-full w-full max-w-md flex-col overflow-y-auto p-8 transition-transform duration-500 ease-luxury ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {poi && (
          <>
            <button
              type="button"
              onClick={onClose}
              className="self-end font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-foreground"
            >
              Cerrar ✕
            </button>

            <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-poi">
              {TYPE_LABEL[poi.type]}
            </span>
            <h2 className="mt-3 text-2xl font-light text-foreground">
              {poi.details.heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {poi.details.body}
            </p>

            {poi.moodBoardItems && poi.moodBoardItems.length > 0 && (
              <div className="mt-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle">
                  Materiales
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {poi.moodBoardItems.map((m) => (
                    <span
                      key={m}
                      className="rounded-pill border border-white/10 bg-surface px-3 py-1 text-xs text-muted"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-card border border-white/10">
              <Image
                src={moodBoard}
                alt="Mood board de materiales"
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
}

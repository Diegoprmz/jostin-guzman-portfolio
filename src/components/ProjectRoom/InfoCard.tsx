"use client";

import Image from "next/image";
import { useState } from "react";
import type { PointOfInterest, POIType } from "@/types/poi";

const TYPE_LABEL: Record<POIType, string> = {
  material: "Material",
  concept: "Concepto",
  detail: "Detalle",
  structural: "Estructura",
};

/**
 * Floating dark-glass card for a POI. Its images show in a slider when there's
 * more than one, and any image opens full-screen (lightbox) on click. Mounted
 * only while a POI is open; the parent gives it a key per POI so slider state
 * resets between points.
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
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);

  if (!poi) return null;

  const images =
    poi.details.images && poi.details.images.length > 0
      ? poi.details.images
      : [moodBoard];
  const many = images.length > 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
        style={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", animation: "fade-in 0.3s ease both" }}
      />

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

          {/* image / slider — click to open full-screen */}
          <div className="group relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-btn border border-white/10">
            <Image
              key={images[idx]}
              src={images[idx]}
              alt=""
              fill
              sizes="440px"
              className="cursor-zoom-in object-cover"
              style={{ animation: "fade-in 0.35s ease both" }}
              onClick={() => setZoom(images[idx])}
            />
            <span className="pointer-events-none absolute right-2 bottom-2 rounded-pill bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
              Ampliar
            </span>

            {many && (
              <>
                <button
                  type="button"
                  onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur transition-colors hover:bg-black/70"
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setIdx((i) => (i + 1) % images.length)}
                  className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur transition-colors hover:bg-black/70"
                  aria-label="Siguiente"
                >
                  ›
                </button>
                <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Imagen ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === idx ? "w-5 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/90 p-6"
          style={{ animation: "fade-in 0.25s ease both" }}
          onClick={() => setZoom(null)}
        >
          <div className="relative h-[85vh] w-[92vw]">
            <Image src={zoom} alt="" fill sizes="92vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setZoom(null)}
            className="absolute top-6 right-6 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
          >
            Cerrar ✕
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Global cursor liquid-glass: a small frosted lens that follows the pointer,
 * distorts what's behind it (backdrop-filter), and — key — deforms with motion:
 * it stretches along the drag direction and squashes perpendicular, scaled by
 * speed, so it reads as a living blob of glass rather than a static circle.
 * Disabled on touch / reduced-motion.
 */
export function CursorGlass() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (coarse || reduced) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      shown = true;
    };
    const loop = () => {
      const px = cx;
      const py = cy;
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;

      const vx = cx - px;
      const vy = cy - py;
      const speed = Math.hypot(vx, vy);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = Math.min(speed * 0.028, 0.55); // cap the deformation

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
        wrapRef.current.style.opacity = shown ? "1" : "0";
      }
      if (lensRef.current) {
        lensRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.55})`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] opacity-0 transition-opacity duration-500 will-change-transform"
      aria-hidden
    >
      <div
        ref={lensRef}
        className="h-12 w-12 rounded-full will-change-transform"
        style={{
          backdropFilter: "blur(4px) saturate(1.12)",
          WebkitBackdropFilter: "blur(4px) saturate(1.12)",
          background:
            "radial-gradient(circle at 36% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 52%, transparent 74%)",
          boxShadow:
            "inset 0 0 16px rgba(255,255,255,0.05), 0 0 14px rgba(212,175,55,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}

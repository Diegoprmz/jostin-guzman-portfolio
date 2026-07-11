"use client";

import { useEffect, useRef } from "react";

/**
 * Global cursor liquid-glass: a frosted lens that follows the pointer and
 * distorts whatever is behind it (backdrop-filter), plus a soft warm light
 * glow (screen blend) that illuminates the scene — so moving the mouse feels
 * physical/interactive across the whole site. Disabled on touch / reduced-motion.
 */
export function CursorGlass() {
  const wrapRef = useRef<HTMLDivElement>(null);

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
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
        wrapRef.current.style.opacity = shown ? "1" : "0";
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
      {/* soft warm light that lifts whatever is behind it */}
      <div
        className="absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,238,210,0.10), rgba(255,238,210,0) 65%)",
          mixBlendMode: "screen",
        }}
      />
      {/* frosted glass lens with a specular glint */}
      <div
        className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          backdropFilter: "blur(5px) saturate(1.15) brightness(1.04)",
          WebkitBackdropFilter: "blur(5px) saturate(1.15) brightness(1.04)",
          background:
            "radial-gradient(circle at 36% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.03) 46%, transparent 72%)",
          boxShadow:
            "inset 0 0 26px rgba(255,255,255,0.06), 0 0 34px rgba(212,175,55,0.10)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      />
    </div>
  );
}

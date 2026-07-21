"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { subscribeTilt } from "@/lib/tilt";

/**
 * Foreground camera-parallax: translates its children MORE than the distant
 * backdrop moves, so the content reads as a near plane floating above the far
 * studio photo — instead of feeling glued to it. rAF-smoothed; sits still on
 * reduced-motion.
 */
export function ForegroundParallax({
  children,
  strength = 28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      if (ref.current) {
        ref.current.style.transform = `translate(${cx * -strength}px, ${cy * -strength}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const unsub = subscribeTilt((nx, ny) => {
      tx = nx;
      ty = ny;
    });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Single-render scene with a subtle camera parallax: the render drifts (and is
 * slightly over-scaled to hide edges) with the mouse, and the POI overlay
 * tracks it so droplets stay pinned to the image. GPU transforms + rAF lerp;
 * reduced-motion sits still.
 */
export function ParallaxScene({
  scene,
  children,
}: {
  scene: string;
  children?: ReactNode;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const poiRef = useRef<HTMLDivElement>(null);

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

    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (sceneRef.current) {
        sceneRef.current.style.transform = `translate(${cx * -26}px, ${cy * -26}px) scale(1.12)`;
      }
      if (poiRef.current) {
        poiRef.current.style.transform = `translate(${cx * -26}px, ${cy * -26}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={sceneRef} className="absolute inset-0 will-change-transform">
        <Image
          src={scene}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <div ref={poiRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}

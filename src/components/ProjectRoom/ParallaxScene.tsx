"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Single-render scene with mouse camera parallax and a subtle push-in "zoom
 * toward the POI" when one is focused. Scene and POI overlay share the exact
 * same transform so droplets stay pinned to the render. rAF-lerped; reduced
 * motion snaps without parallax.
 */
export function ParallaxScene({
  scene,
  focus,
  children,
}: {
  scene: string;
  focus?: { x: number; y: number } | null;
  children?: ReactNode;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const poiRef = useRef<HTMLDivElement>(null);
  const targetScale = useRef(1.12);

  useEffect(() => {
    targetScale.current = focus ? 1.24 : 1.12;
  }, [focus]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let sc = 1.12;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const apply = () => {
      const t = `translate(${(cx * -26).toFixed(2)}px, ${(cy * -26).toFixed(2)}px) scale(${sc.toFixed(4)})`;
      if (sceneRef.current) sceneRef.current.style.transform = t;
      if (poiRef.current) poiRef.current.style.transform = t;
    };
    const loop = () => {
      if (!reduced) {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
      }
      sc += (targetScale.current - sc) * (reduced ? 1 : 0.08);
      apply();
      raf = requestAnimationFrame(loop);
    };

    if (!reduced) window.addEventListener("mousemove", onMove);
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

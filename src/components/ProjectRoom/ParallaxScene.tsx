"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import type { ParallaxLayers } from "@/types/project";

/**
 * 2D depth parallax: three render layers (far/mid/close) translate at
 * increasing strength with the mouse, so the scene reads as having depth.
 * The POI overlay tracks the closest layer so droplets stay pinned to the
 * scene. GPU transforms + rAF lerp = smooth 60fps; reduced-motion sits still.
 */
export function ParallaxScene({
  layers,
  children,
}: {
  layers: ParallaxLayers;
  children?: ReactNode;
}) {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
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
    const layer = (el: HTMLDivElement | null, s: number) => {
      if (el) el.style.transform = `translate(${cx * -s}px, ${cy * -s}px) scale(1.14)`;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      layer(farRef.current, 10);
      layer(midRef.current, 26);
      layer(nearRef.current, 46);
      if (poiRef.current) {
        poiRef.current.style.transform = `translate(${cx * -46}px, ${cy * -46}px)`;
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

  const layerCls = "absolute inset-0 will-change-transform";
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={farRef} className={layerCls}>
        <Image src={layers.far} alt="" fill sizes="100vw" className="object-cover" priority />
      </div>
      <div ref={midRef} className={layerCls}>
        <Image src={layers.mid} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div ref={nearRef} className={layerCls}>
        <Image src={layers.close} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div ref={poiRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}

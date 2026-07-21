"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { subscribeTilt } from "@/lib/tilt";

/**
 * Black & white studio portrait with mouse parallax depth: the portrait drifts
 * one way and a warm studio glow behind it drifts the other, giving the sense
 * of layered depth and putting Jostin front and centre. Smoothed via a rAF lerp.
 */
export function HeroPortrait() {
  const imgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (imgRef.current) {
        imgRef.current.style.transform = `translate(${cx * -16}px, ${cy * -16}px) scale(1.05)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${cx * 30}px, ${cy * 30}px)`;
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
  }, []);

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-10 will-change-transform"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 40%, rgba(212,175,55,0.12), transparent 70%)",
        }}
      />
      <div
        ref={imgRef}
        className="relative h-full w-full overflow-hidden rounded-card border border-white/10 shadow-elevated will-change-transform"
      >
        <Image
          src="/images/hero/feature.jpg"
          alt="Proyecto destacado — Mercado Villa de Guadalupe"
          fill
          sizes="(max-width: 1024px) 90vw, 420px"
          className="object-cover"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.55), transparent 55%)",
          }}
        />
      </div>
    </div>
  );
}

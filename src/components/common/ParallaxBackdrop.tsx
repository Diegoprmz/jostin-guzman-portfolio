"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Layered, cursor-driven camera-parallax backdrop (the rev-4 idea):
 *  - deepest: a very dim architecture-studio photo (swap the placeholder for
 *    the real one at /images/hero/studio-bg.jpg)
 *  - middle: soft color blobs + noise grain
 *  - a vignette on top
 * Each layer drifts at a different strength with the mouse, so the dark-glass
 * content above appears to float in a 3D space. Sits at the lowest z.
 */
export function ParallaxBackdrop() {
  const photoRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);

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
    const set = (el: HTMLDivElement | null, s: number) => {
      if (el) el.style.transform = `translate(${cx * -s}px, ${cy * -s}px) scale(1.08)`;
    };
    const loop = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      set(photoRef.current, 24);
      set(midRef.current, 52);
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
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-background"
    >
      {/* deep: dimmed studio photo */}
      <div ref={photoRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero/studio-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-background/55" />
      </div>

      {/* mid: soft depth blobs + noise */}
      <div ref={midRef} className="absolute inset-0 will-change-transform">
        <div
          className="absolute -left-24 top-1/4 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(60,111,224,0.10), transparent 70%)",
          }}
        />
        <div
          className="absolute -right-16 -top-20 h-[30rem] w-[30rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: NOISE, backgroundSize: "160px" }}
        />
      </div>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 35%, transparent 55%, rgba(0,0,0,0.6))",
        }}
      />
    </div>
  );
}

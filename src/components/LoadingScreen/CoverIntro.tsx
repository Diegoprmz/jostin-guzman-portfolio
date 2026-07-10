"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import { FloorWater } from "./FloorWater";

const SIDE_WORDS = [
  "DESIGN",
  "SKETCH",
  "MODELING",
  "RENDER",
  "MOCKUP",
  "PROJECT",
];

/**
 * Intro: the portfolio cover (light) sits underneath a full-screen black
 * "door" that sweeps left, revealing the cover — light spilling through the
 * opening. After a beat it fades and enters the dark showroom (/menu).
 *
 * Debug: append `?open` to freeze the revealed cover (door already gone).
 */
export function CoverIntro() {
  const shutterRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const open = new URLSearchParams(window.location.search).has("open");

    router.prefetch("/menu");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      window.setTimeout(() => router.push("/menu"), 700);
    };
    skipRef.current = finish;

    let tl: gsap.core.Timeline | null = null;
    let safety = 0;

    if (open) {
      gsap.set(shutterRef.current, { xPercent: -100 });
    } else if (reduced) {
      gsap.set(shutterRef.current, { xPercent: -100 });
      window.setTimeout(finish, 1400);
    } else {
      tl = gsap.timeline();
      tl.set(shutterRef.current, { xPercent: 0 })
        .to({}, { duration: 0.35 })
        .to(shutterRef.current, {
          xPercent: -100,
          duration: 1.8,
          ease: "power3.inOut",
        })
        .to({}, { duration: 1.9 })
        .call(finish);
      safety = window.setTimeout(finish, 9000);
    }

    return () => {
      tl?.kill();
      window.clearTimeout(safety);
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-black transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ---- COVER (revealed background) ---- */}
      <div className="absolute inset-0 bg-white">
        {/* liquid-glass water floor reflecting the warm door light */}
        <FloorWater className="pointer-events-none absolute inset-x-0 bottom-0 block h-[18%] w-full" />

        {/* logo + wordmark + name (centered above the floor) */}
        <div className="absolute inset-x-0 top-0 bottom-[16%] flex flex-col items-center justify-center gap-8 pl-[28%]">
          <div className="flex items-center gap-5">
            <Image
              src="/images/ui/logo-cover.png"
              alt="Logo Jostin Guzmán"
              width={282}
              height={282}
              priority
              className="h-24 w-auto sm:h-28"
            />
            <div className="flex flex-col leading-tight text-neutral-500">
              <span className="text-2xl font-light sm:text-3xl">Portafolio</span>
              <span className="text-2xl font-light sm:text-3xl">
                Arquitectura
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-light tracking-wide text-neutral-900 sm:text-6xl">
            Jostin Guzmán
          </h1>
        </div>

        {/* left franja (part of the cover) — trimmed to sit on the floor */}
        <div className="absolute top-0 bottom-[16%] left-0 w-[28%] bg-[#0b0b0d]">
          <div className="absolute inset-y-0 right-8 flex flex-col items-center justify-center gap-2 text-white/70">
            {SIDE_WORDS.map((w) => (
              <span
                key={w}
                className="font-mono text-[9px] tracking-[0.25em]"
                style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
              >
                {w}
              </span>
            ))}
            <span
              className="mt-1 font-mono text-[8px] tracking-[0.2em] text-white/45"
              style={{ writingMode: "vertical-rl" }}
            >
              2019 — 2026
            </span>
          </div>
          <div className="absolute top-1/2 right-5 h-2/5 w-px -translate-y-1/2 bg-[#1e50c8]" />
          {/* warm light at the wall base softens the bottom edge */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{
              background: "linear-gradient(to top, rgba(255,232,200,0.4), transparent)",
            }}
          />
        </div>
      </div>

      {/* ---- DOOR (sweeps left) — trimmed to the wall height, floor stays lit ---- */}
      <div
        ref={shutterRef}
        className="absolute top-0 bottom-[16%] left-0 right-0 bg-[#0a0a0a]"
      >
        {/* light bleeding through the opening edge */}
        <div
          className="absolute inset-y-0 right-0 w-[2px] bg-white/85"
          style={{ boxShadow: "0 0 60px 14px rgba(255,244,224,0.45)" }}
        />
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute right-8 bottom-8 z-10 font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-neutral-800"
      >
        Saltar
      </button>
    </div>
  );
}

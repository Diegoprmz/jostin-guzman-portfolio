"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { LogoMark } from "@/components/common/LogoMark";

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
        .to({}, { duration: 1.2 })
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
        {/* warm floor light */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background:
              "linear-gradient(to top, rgba(255,238,214,0.85), rgba(255,255,255,0) 72%)",
          }}
        />

        {/* logo + wordmark + name */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 pl-[28%]">
          <div className="flex items-center gap-5">
            <LogoMark
              className="h-24 w-24 sm:h-28 sm:w-28"
              stroke="#2b2b2b"
              accent="#1e50c8"
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

        {/* left franja (part of the cover) */}
        <div className="absolute inset-y-0 left-0 w-[28%] bg-[#0b0b0d]">
          <div className="absolute top-0 right-8 flex h-full flex-col items-center justify-center gap-5 text-white/75">
            {SIDE_WORDS.map((w) => (
              <span
                key={w}
                className="font-mono text-[10px] tracking-[0.35em]"
                style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
              >
                {w}
              </span>
            ))}
          </div>
          <div className="absolute top-1/2 right-5 h-1/2 w-px -translate-y-1/2 bg-[#1e50c8]" />
          <span
            className="absolute right-5 bottom-10 font-mono text-[9px] tracking-[0.3em] text-white/50"
            style={{ writingMode: "vertical-rl" }}
          >
            2019 — 2026
          </span>
        </div>
      </div>

      {/* ---- DOOR (sweeps left) ---- */}
      <div ref={shutterRef} className="absolute inset-0 bg-[#0a0a0a]">
        {/* light bleeding through the opening edge */}
        <div
          className="absolute inset-y-0 right-0 w-[3px] bg-white/90"
          style={{ boxShadow: "0 0 90px 26px rgba(255,244,224,0.6)" }}
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

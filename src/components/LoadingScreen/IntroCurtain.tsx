"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LogoMark } from "@/components/common/LogoMark";
import { FluidWater } from "./FluidWater";

const SIDE_WORDS = ["DESIGN", "SKETCH", "MODELING", "RENDER", "MOCKUP", "PROJECT"];

/**
 * Dark-glass intro curtain. A full-screen interactive fluid is the background;
 * the branding floats on frosted glass; a black door sweeps left to reveal it,
 * then the whole curtain dissolves to expose the page beneath. Lives in the
 * root layout, so it replays on every hard reload (not on soft navigations).
 *
 * Debug: `?open` freezes the revealed state.
 */
export function IntroCurtain() {
  const shutterRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const open = new URLSearchParams(window.location.search).has("open");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      window.setTimeout(() => setDone(true), 750);
    };
    skipRef.current = finish;

    let tl: gsap.core.Timeline | null = null;
    let safety = 0;

    if (open) {
      gsap.set(shutterRef.current, { xPercent: -100 });
    } else if (reduced) {
      gsap.set(shutterRef.current, { xPercent: -100 });
      window.setTimeout(finish, 1600);
    } else {
      tl = gsap.timeline();
      tl.set(shutterRef.current, { xPercent: 0 })
        .to({}, { duration: 0.35 })
        .to(shutterRef.current, {
          xPercent: -100,
          duration: 1.7,
          ease: "power3.inOut",
        })
        .to({}, { duration: 1.7 })
        .call(finish);
      safety = window.setTimeout(finish, 9000);
    }

    return () => {
      tl?.kill();
      window.clearTimeout(safety);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#070708] transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* full-screen interactive fluid background */}
      <FluidWater className="pointer-events-none absolute inset-0 block h-full w-full" />

      {/* subtle depth wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, rgba(20,20,26,0.0), rgba(0,0,0,0.55))",
        }}
      />

      {/* branding on frosted glass */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div className="glass relative flex flex-col items-center gap-6 rounded-card px-10 py-9 shadow-elevated sm:px-14 sm:py-11">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="flex items-center gap-4">
            <LogoMark
              className="h-16 w-16 sm:h-20 sm:w-20"
              stroke="#f0ece2"
              accent="#3b6fe0"
            />
            <div className="flex flex-col leading-tight text-muted">
              <span className="text-xl font-light sm:text-2xl">Portafolio</span>
              <span className="text-xl font-light sm:text-2xl">Arquitectura</span>
            </div>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Jostin Guzmán
          </h1>
        </div>
      </div>

      {/* left franja — glass strip with vertical wordmark */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[14%] min-w-14 border-r border-white/5 bg-black/30 backdrop-blur-sm">
        <div className="absolute inset-y-0 right-4 flex flex-col items-center justify-center gap-3 text-white/60">
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
            className="mt-1 font-mono text-[8px] tracking-[0.2em] text-white/35"
            style={{ writingMode: "vertical-rl" }}
          >
            2019 — 2026
          </span>
        </div>
      </div>

      {/* door that sweeps left to reveal the fluid + branding */}
      <div
        ref={shutterRef}
        className="absolute inset-0 bg-[#050506]"
      >
        <div
          className="absolute inset-y-0 right-0 w-[2px] bg-white/80"
          style={{ boxShadow: "0 0 70px 16px rgba(255,244,224,0.5)" }}
        />
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute right-8 bottom-8 z-10 font-mono text-xs uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white"
      >
        Saltar
      </button>
    </div>
  );
}

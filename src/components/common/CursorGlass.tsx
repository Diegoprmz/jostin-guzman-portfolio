"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const GLASS: CSSProperties = {
  backdropFilter: "blur(4px) saturate(1.12)",
  WebkitBackdropFilter: "blur(4px) saturate(1.12)",
  background:
    "radial-gradient(circle at 36% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 52%, transparent 74%)",
  boxShadow:
    "inset 0 0 14px rgba(255,255,255,0.05), 0 0 12px rgba(212,175,55,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

// successive drops shrink — like a cell dividing into smaller ones
const SPAWN_SIZE = [0.66, 0.55, 0.45, 0.37, 0.3, 0.24];
const LIFE_MS = 1000; // bubbles linger, then fade out over 1s
const SPAWN_MS = 150; // throttle between drops (lower = more bubbles)
const SPEED_MIN = 5; // only shed bubbles when moving with intent

type Bubble = { active: boolean; x: number; y: number; born: number; scale: number };

/**
 * The cursor: a ~30px liquid-glass lens replaces the native pointer, distorts
 * what's behind it, and deforms with motion. Moving fast sheds a trail of
 * ever-smaller glass bubbles that stay put and fade out over ~1s (up to 6).
 * Disabled on touch / reduced-motion.
 */
export function CursorGlass() {
  const mainRef = useRef<HTMLDivElement>(null);
  const b0 = useRef<HTMLDivElement>(null);
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);
  const b4 = useRef<HTMLDivElement>(null);
  const b5 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bubbleRefs = [b0, b1, b2, b3, b4, b5];
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (coarse || reduced) return;

    const root = document.documentElement;
    const prevCursor = root.style.cursor;
    root.style.cursor = "none"; // the glass ball is the cursor now

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let shown = false;
    let raf = 0;

    const pool: Bubble[] = bubbleRefs.map(() => ({
      active: false,
      x: 0,
      y: 0,
      born: 0,
      scale: 0,
    }));
    let slot = 0;
    let spawnCount = 0;
    let lastSpawn = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      shown = true;
    };

    const loop = () => {
      const now = performance.now();
      const prevX = cx;
      const prevY = cy;
      cx += (tx - cx) * 0.32;
      cy += (ty - cy) * 0.32;

      const vx = cx - prevX;
      const vy = cy - prevY;
      const speed = Math.hypot(vx, vy);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = Math.min(speed * 0.045, 0.8);

      if (mainRef.current) {
        mainRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.55})`;
        mainRef.current.style.opacity = shown ? "1" : "0";
      }

      if (shown && speed > SPEED_MIN && now - lastSpawn > SPAWN_MS) {
        lastSpawn = now;
        const b = pool[slot];
        b.active = true;
        b.x = cx;
        b.y = cy;
        b.born = now;
        b.scale = SPAWN_SIZE[spawnCount % SPAWN_SIZE.length];
        slot = (slot + 1) % pool.length;
        spawnCount++;
      }

      for (let i = 0; i < pool.length; i++) {
        const b = pool[i];
        const el = bubbleRefs[i].current;
        if (!el) continue;
        if (!b.active) {
          el.style.opacity = "0";
          continue;
        }
        const age = (now - b.born) / LIFE_MS;
        if (age >= 1) {
          b.active = false;
          el.style.opacity = "0";
          continue;
        }
        el.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%,-50%) scale(${b.scale * (1 - age * 0.35)})`;
        el.style.opacity = String((1 - age) * 0.5);
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      root.style.cursor = prevCursor;
    };
  }, []);

  const bubbleCls =
    "pointer-events-none fixed left-0 top-0 z-[59] h-[30px] w-[30px] rounded-full opacity-0 will-change-transform";
  return (
    <>
      <div ref={b0} aria-hidden className={bubbleCls} style={GLASS} />
      <div ref={b1} aria-hidden className={bubbleCls} style={GLASS} />
      <div ref={b2} aria-hidden className={bubbleCls} style={GLASS} />
      <div ref={b3} aria-hidden className={bubbleCls} style={GLASS} />
      <div ref={b4} aria-hidden className={bubbleCls} style={GLASS} />
      <div ref={b5} aria-hidden className={bubbleCls} style={GLASS} />
      <div
        ref={mainRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[30px] w-[30px] rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
        style={GLASS}
      />
    </>
  );
}

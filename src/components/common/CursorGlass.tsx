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

// trailing bubbles: progressively smaller & fainter, like a cell dividing
const BUBBLE_SCALE = [0.6, 0.42, 0.3];
const BUBBLE_ALPHA = [0.55, 0.38, 0.24];

/**
 * The cursor: a small liquid-glass lens replaces the native pointer. It
 * distorts what's behind (backdrop-filter), deforms with motion (stretch along
 * the drag, squash across), and — when moved fast — sheds 2–3 ever-smaller
 * glass bubbles as a trail. Disabled on touch / reduced-motion (native cursor
 * stays).
 */
export function CursorGlass() {
  const mainRef = useRef<HTMLDivElement>(null);
  const b0 = useRef<HTMLDivElement>(null);
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (coarse || reduced) return;

    const root = document.documentElement;
    const prevCursor = root.style.cursor;
    root.style.cursor = "none"; // the glass ball is the cursor now

    const bubbleRefs = [b0, b1, b2];
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    const px = [tx, tx, tx, tx];
    const py = [ty, ty, ty, ty];
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      shown = true;
    };

    const loop = () => {
      const prevX = px[0];
      const prevY = py[0];
      px[0] += (tx - px[0]) * 0.32;
      py[0] += (ty - py[0]) * 0.32;
      for (let i = 1; i < 4; i++) {
        px[i] += (px[i - 1] - px[i]) * 0.3;
        py[i] += (py[i - 1] - py[i]) * 0.3;
      }

      const vx = px[0] - prevX;
      const vy = py[0] - prevY;
      const speed = Math.hypot(vx, vy);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = Math.min(speed * 0.04, 0.75);
      const trail = Math.min(Math.max((speed - 5) * 0.12, 0), 1);

      if (mainRef.current) {
        mainRef.current.style.transform = `translate(${px[0]}px, ${py[0]}px) translate(-50%,-50%) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.55})`;
        mainRef.current.style.opacity = shown ? "1" : "0";
      }
      for (let i = 0; i < 3; i++) {
        const el = bubbleRefs[i].current;
        if (!el) continue;
        el.style.transform = `translate(${px[i + 1]}px, ${py[i + 1]}px) translate(-50%,-50%) rotate(${angle}deg) scale(${BUBBLE_SCALE[i] * (1 + stretch * 0.4)})`;
        el.style.opacity = shown ? String(trail * BUBBLE_ALPHA[i]) : "0";
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

  return (
    <>
      <div ref={b2} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[59] h-10 w-10 rounded-full opacity-0 will-change-transform" style={GLASS} />
      <div ref={b1} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[59] h-10 w-10 rounded-full opacity-0 will-change-transform" style={GLASS} />
      <div ref={b0} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[59] h-10 w-10 rounded-full opacity-0 will-change-transform" style={GLASS} />
      <div
        ref={mainRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-10 w-10 rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
        style={GLASS}
      />
    </>
  );
}

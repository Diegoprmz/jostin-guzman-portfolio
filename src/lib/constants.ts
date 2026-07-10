/**
 * Shared config & design tokens.
 * CSS handles theming, but Three.js / GSAP need JS-side values
 * (shaders can't read CSS custom properties).
 */

/** Palette mirror — keep in sync with globals.css @theme */
export const COLORS = {
  background: "#0a0a0a",
  foreground: "#f5f5f5",
  surface: "#1a1a1a",
  surface2: "#2a2a2a",
  accent: "#d4af37",
  accentDim: "#9d8a5a",
  muted: "#a8a8a8",
  subtle: "#6a6a6a",
  success: "#10b981",
  error: "#ef4444",
  poi: "#60a5fa",
} as const;

/** Responsive breakpoints (px) — match Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Animation durations (seconds) — feed GSAP / Framer Motion */
export const DURATION = {
  micro: 0.3,
  base: 0.5,
  narrative: 1.2,
  door: 3.5,
} as const;

/** Signature easing — matches --ease-luxury in CSS */
export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

/** Z-index layering — single source of truth for depth stacking */
export const Z_INDEX = {
  canvas: 0,
  poi: 10,
  ui: 20,
  drawer: 30,
  nav: 40,
  loader: 50,
} as const;

/** Parallax depth planes (Three.js Z positions) */
export const PARALLAX_DEPTH = {
  far: -100,
  mid: -50,
  close: 0,
} as const;

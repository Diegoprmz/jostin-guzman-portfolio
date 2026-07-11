/**
 * Layered depth backdrop (the "spheres" + noise from the glassmorphism ref):
 * soft blurred color blobs at different depths, a fine noise grain, and a
 * vignette — sits at the lowest z so glass/neomorphic elements above it read
 * as floating in 3D. Purely decorative, non-interactive.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function SceneBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-background"
    >
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
        className="absolute bottom-[-8rem] left-1/3 h-[24rem] w-[24rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: "160px" }}
      />
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

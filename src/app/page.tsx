export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Portafolio · 2026
      </span>

      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Jostin Guzmán
      </h1>

      <p className="max-w-md text-lg leading-8 text-muted">
        Arquitecto. Experiencia showroom en construcción — el recorrido
        inmersivo está en camino.
      </p>

      <div className="glass rounded-card px-6 py-4 font-mono text-sm text-subtle shadow-soft">
        Theme system online — dark luxury
      </div>

      {/* Token preview: verifies palette utilities resolve */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <span className="rounded-btn bg-surface px-4 py-2 text-sm text-foreground">
          surface
        </span>
        <span className="rounded-btn bg-accent px-4 py-2 text-sm font-medium text-background">
          accent
        </span>
        <span className="rounded-pill border border-poi/60 px-4 py-2 text-sm text-poi shadow-glow">
          poi glow
        </span>
      </div>
    </main>
  );
}

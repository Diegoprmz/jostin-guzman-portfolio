import { getProjectSummaries } from "@/lib/projects";
import { LogoMark } from "@/components/common/LogoMark";
import { HeroPortrait } from "@/components/Menu/HeroPortrait";
import { ProjectCard } from "@/components/Menu/ProjectCard";

export default function MenuPage() {
  const projects = getProjectSummaries();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* studio light from top-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 72% 0%, rgba(212,175,55,0.06), transparent 70%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <LogoMark className="h-8 w-8" stroke="#f0ece2" accent="#3b6fe0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            Jostin Guzmán · Arquitectura
          </span>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[400px_1fr] lg:gap-16 lg:py-16">
        <HeroPortrait />

        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Portafolio · Showroom
          </span>
          <h1 className="mt-4 text-5xl font-light tracking-tight text-foreground sm:text-6xl">
            Jostin Guzmán
          </h1>
          <p className="mt-4 max-w-md text-muted">
            Arquitecto. Cada proyecto vive en su propia sala — selecciona uno
            para entrar.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i + 1} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

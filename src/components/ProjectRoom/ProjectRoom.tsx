"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { LogoMark } from "@/components/common/LogoMark";
import { ParallaxScene } from "./ParallaxScene";
import { PoiDroplet } from "./PoiDroplet";
import { InfoCard } from "./InfoCard";

export function ProjectRoom({ project }: { project: Project }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = project.poi.find((p) => p.id === activeId) ?? null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <ParallaxScene scene={project.hero.scene}>
        {project.poi.map((poi) => (
          <PoiDroplet
            key={poi.id}
            poi={poi}
            active={poi.id === activeId}
            onClick={() =>
              setActiveId((id) => (id === poi.id ? null : poi.id))
            }
          />
        ))}
      </ParallaxScene>

      {/* light legibility wash (info now lives in its own glass card) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,12,0.55), transparent 40%)",
        }}
      />

      {/* header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-6 sm:p-8">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> Showroom
        </Link>
        <div className="pointer-events-auto flex items-center gap-4">
          <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
            {project.prevProject && (
              <Link
                href={`/project/${project.prevProject}`}
                className="text-muted transition-colors hover:text-foreground"
              >
                Ant
              </Link>
            )}
            {project.prevProject && project.nextProject && (
              <span className="text-subtle">/</span>
            )}
            {project.nextProject && (
              <Link
                href={`/project/${project.nextProject}`}
                className="text-muted transition-colors hover:text-foreground"
              >
                Sig
              </Link>
            )}
          </nav>
          <LogoMark className="h-7 w-7" />
        </div>
      </header>

      {/* title — compact glass card, bottom-left */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-20 sm:bottom-8 sm:left-8">
        <div
          className="max-w-xs rounded-card border border-white/10 p-5 sm:max-w-sm sm:p-6"
          style={{
            backdropFilter: "blur(20px) saturate(1.1)",
            WebkitBackdropFilter: "blur(20px) saturate(1.1)",
            background: "rgba(10,10,12,0.35)",
          }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            {project.category}
            {project.award ? ` · ${project.award}` : ""}
          </span>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-2 font-mono text-xs tracking-wide text-muted">
            {project.location} · {project.year}
            {project.area ? ` · ${project.area}` : ""}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-poi/80">
            ◇ {project.poi.length} puntos · toca para explorar
          </p>
        </div>
      </div>

      <InfoCard
        poi={active}
        moodBoard={project.hero.moodBoard}
        onClose={() => setActiveId(null)}
      />
    </main>
  );
}

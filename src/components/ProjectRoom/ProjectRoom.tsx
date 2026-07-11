"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/project";
import { LogoMark } from "@/components/common/LogoMark";
import { ParallaxScene } from "./ParallaxScene";
import { PoiDroplet } from "./PoiDroplet";
import { InfoDrawer } from "./InfoDrawer";

export function ProjectRoom({ project }: { project: Project }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = project.poi.find((p) => p.id === activeId) ?? null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <ParallaxScene layers={project.hero.parallaxLayers}>
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

      {/* legibility gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,12,0.80), transparent 45%), linear-gradient(to right, rgba(10,10,12,0.6), transparent 35%)",
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
          <LogoMark className="h-7 w-7" stroke="#f0ece2" accent="#3b6fe0" />
        </div>
      </header>

      {/* title block */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 max-w-xl p-6 sm:p-10">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {project.category}
          {project.award ? ` · ${project.award}` : ""}
        </span>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-2 font-mono text-xs tracking-wide text-muted">
          {project.location} · {project.year}
          {project.area ? ` · ${project.area}` : ""}
        </p>
        <p className="mt-4 hidden max-w-md text-sm leading-relaxed text-muted sm:block">
          {project.description}
        </p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-poi/80">
          ◇ {project.poi.length} puntos de interés · toca para explorar
        </p>
      </div>

      <InfoDrawer
        poi={active}
        moodBoard={project.hero.moodBoard}
        onClose={() => setActiveId(null)}
      />
    </main>
  );
}

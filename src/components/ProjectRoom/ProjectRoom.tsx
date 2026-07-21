"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

/**
 * Run the entrance before the browser paints, so the room never flashes its
 * final state and then jumps back to the start (that's what read as "paused").
 */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import type { Project } from "@/types/project";
import { LogoMark } from "@/components/common/LogoMark";
import { ParallaxScene } from "./ParallaxScene";
import { PoiDroplet } from "./PoiDroplet";
import { InfoCard } from "./InfoCard";

/** Signal the next room how we arrived, so it can pick its entrance. */
function markTransition(kind: string) {
  try {
    sessionStorage.setItem("roomTx", kind);
  } catch {
    /* ignore */
  }
}

export function ProjectRoom({ project }: { project: Project }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = project.poi.findIndex((p) => p.id === activeId);
  const active = activeIndex >= 0 ? project.poi[activeIndex] : null;
  const rootRef = useRef<HTMLElement>(null);

  // Entrance transition based on how we got here (runs before first paint).
  useIsoLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let kind = "";
    try {
      kind = sessionStorage.getItem("roomTx") ?? "";
      sessionStorage.removeItem("roomTx");
    } catch {
      /* ignore */
    }
    if (reduced) return;

    // No blur: animating a full-screen filter is what made it stutter.
    if (kind === "enter") {
      // walk into the room: dolly forward
      gsap.from(el, {
        scale: 1.14,
        opacity: 0,
        duration: 0.65,
        ease: "expo.out",
        force3D: true,
      });
    } else if (kind === "next" || kind === "prev") {
      // Inside-a-cube camera turn: the incoming wall is HINGED at the screen
      // edge (transform-origin) and swings from edge-on to facing you. No
      // sideways translation — that's what made it look like it travelled the
      // wrong way and then straightened out.
      const next = kind === "next";
      gsap.from(el, {
        rotationY: next ? -78 : 78,
        transformOrigin: next ? "right center" : "left center",
        transformPerspective: 900,
        opacity: 0.35,
        duration: 0.7,
        ease: "power3.out",
        force3D: true,
      });
    } else {
      gsap.from(el, { opacity: 0, duration: 0.35, ease: "power1.out" });
    }
  }, []);

  const goToPoi = (dir: number) => {
    const n = project.poi.length;
    if (n === 0) return;
    const base = activeIndex < 0 ? 0 : activeIndex;
    setActiveId(project.poi[(base + dir + n) % n].id);
  };

  return (
    <main
      ref={rootRef}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <ParallaxScene
        scene={project.hero.scene}
        focus={active ? active.position : null}
      >
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

      {/* light legibility wash */}
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
          onClick={() => markTransition("back")}
          className="pointer-events-auto flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> Showroom
        </Link>
        <div className="pointer-events-auto flex items-center gap-4">
          <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
            {project.prevProject && (
              <Link
                href={`/project/${project.prevProject}`}
                onClick={() => markTransition("prev")}
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
                onClick={() => markTransition("next")}
                className="text-muted transition-colors hover:text-foreground"
              >
                Sig
              </Link>
            )}
          </nav>
          <LogoMark className="h-7 w-7" />
        </div>
      </header>

      {/* title — compact glass card, top-left (below header) */}
      <div className="pointer-events-none absolute top-20 left-6 z-20 sm:top-24 sm:left-8">
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
        key={active ? active.id : "closed"}
        poi={active}
        moodBoard={project.hero.moodBoard}
        index={activeIndex}
        total={project.poi.length}
        onNavigate={goToPoi}
        onClose={() => setActiveId(null)}
      />
    </main>
  );
}

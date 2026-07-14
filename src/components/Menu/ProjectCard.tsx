"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProjectSummary } from "@/types/project";

/**
 * Dark-neomorphic card: soft dual shadows (deep bottom-right + faint top-left
 * highlight) make it read as raised off the textured backdrop; a top sheen
 * "glint" separates it further. Grayscale thumbnail warms to color on hover.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: ProjectSummary;
  index: number;
}) {
  const meta = [project.category, project.location, String(project.year)]
    .concat(project.award ? [project.award] : [])
    .join("  ·  ");

  return (
    <Link
      href={`/project/${project.slug}`}
      onClick={() => {
        try {
          sessionStorage.setItem("roomTx", "enter");
        } catch {
          /* ignore */
        }
      }}
      className="group relative flex items-center gap-5 overflow-hidden rounded-card bg-surface/70 p-4 shadow-[6px_6px_20px_rgba(0,0,0,0.55),-5px_-5px_14px_rgba(255,255,255,0.02)] transition-all duration-500 ease-luxury hover:-translate-y-0.5 hover:bg-surface hover:shadow-[0_12px_34px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,55,0.12)]"
    >
      {/* top sheen glint */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <span className="font-mono text-xs text-accent/60 tabular-nums">
        {String(index).padStart(2, "0")}
      </span>

      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-btn shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="112px"
          className="object-cover grayscale transition-all duration-700 ease-luxury group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-medium text-foreground transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-1 truncate font-mono text-xs tracking-wide text-muted">
          {meta}
        </p>
      </div>

      <span
        aria-hidden
        className="translate-x-[-8px] text-accent opacity-0 transition-all duration-500 ease-luxury group-hover:translate-x-0 group-hover:opacity-100"
      >
        →
      </span>
    </Link>
  );
}

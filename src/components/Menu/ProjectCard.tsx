import Link from "next/link";
import Image from "next/image";
import type { ProjectSummary } from "@/types/project";

/**
 * Full-width horizontal card for a project in the showroom menu. Grayscale
 * thumbnail warms to color on hover (an architecture-portfolio staple), links
 * into the project's room.
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
      className="group relative flex items-center gap-5 overflow-hidden rounded-card border border-white/5 bg-surface/40 p-4 transition-all duration-500 ease-luxury hover:border-accent/40 hover:bg-surface"
    >
      <span className="font-mono text-xs text-accent/60 tabular-nums">
        {String(index).padStart(2, "0")}
      </span>

      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-btn">
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

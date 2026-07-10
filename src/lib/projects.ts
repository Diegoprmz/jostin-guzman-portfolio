import projectsData from "@/data/projects.json";
import { projectsFileSchema } from "@/data/projects.schema";
import type { Project, ProjectSummary } from "@/types/project";

/**
 * Central access point for project data.
 * JSON is validated once with Zod, then cached. The cast to `Project[]`
 * is the drift guard: if the schema and the interfaces diverge, this fails
 * to compile.
 */
let cache: Project[] | null = null;

function load(): Project[] {
  if (cache) return cache;
  const parsed = projectsFileSchema.parse(projectsData);
  cache = parsed.projects;
  return cache;
}

export function getAllProjects(): Project[] {
  return load();
}

export function getProjectSummaries(): ProjectSummary[] {
  return load().map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    year: p.year,
    location: p.location,
    category: p.category,
    award: p.award,
    description: p.description,
    image: p.hero.image,
  }));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return load().find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return load().map((p) => p.slug);
}

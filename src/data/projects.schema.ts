import { z } from "zod";

/**
 * Runtime validation for projects.json.
 * The inferred output is checked against the hand-written interfaces
 * in @/types (the loader assigns parsed data to `Project[]`), so any
 * drift between this schema and the types fails the type-check.
 */

export const poiTypeSchema = z.enum([
  "material",
  "concept",
  "detail",
  "structural",
]);

export const poiSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  position: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
  type: poiTypeSchema,
  details: z.object({
    heading: z.string(),
    body: z.string(),
    images: z.array(z.string()).optional(),
  }),
  moodBoardItems: z.array(z.string()).optional(),
  radius: z.number().positive(),
  glowIntensity: z.number().min(0.5).max(2),
});

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  year: z.number().int(),
  location: z.string(),
  category: z.string(),
  award: z.string().optional(),
  description: z.string(),
  longDescription: z.string(),
  client: z.string().optional(),
  area: z.string().optional(),
  team: z.array(z.string()).optional(),
  hero: z.object({
    image: z.string(),
    scene: z.string(),
    moodBoard: z.string(),
  }),
  poi: z.array(poiSchema),
  nextProject: z.string().optional(),
  prevProject: z.string().optional(),
});

export const projectsFileSchema = z.object({
  projects: z.array(projectSchema),
});

export type ProjectsFile = z.infer<typeof projectsFileSchema>;

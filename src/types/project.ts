import type { PointOfInterest } from "@/types/poi";

export interface ProjectHero {
  /** Thumbnail used on the menu card. */
  image: string;
  /** The room render shown behind the POIs (single flat render). */
  scene: string;
  /** Material / plan mood-board image shown in the drawer. */
  moodBoard: string;
}

/** A full architecture project with its interactive scene. */
export interface Project {
  id: string;
  slug: string;
  title: string;
  year: number;
  location: string;
  category: string;
  award?: string;
  description: string;
  longDescription: string;
  client?: string;
  area?: string;
  team?: string[];
  hero: ProjectHero;
  poi: PointOfInterest[];
  nextProject?: string;
  prevProject?: string;
}

/** Lightweight shape returned by the list endpoint / menu cards. */
export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  year: number;
  location: string;
  category: string;
  award?: string;
  description: string;
  image: string;
  /** Room render — cards preload this on hover so entering feels instant. */
  scene: string;
}

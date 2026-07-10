import type { PointOfInterest } from "@/types/poi";

/** Depth planes for the 2D parallax scene. */
export interface ParallaxLayers {
  far: string;
  mid: string;
  close: string;
}

export interface ProjectHero {
  /** Thumbnail used on the menu card. */
  image: string;
  parallaxLayers: ParallaxLayers;
  /** Material mood-board image. */
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
}

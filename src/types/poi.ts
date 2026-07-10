/** Category of an interactive point — drives icon/label styling. */
export type POIType = "material" | "concept" | "detail" | "structural";

/** Position as a percentage of the scene (0–100), resolution-independent. */
export interface POIPosition {
  x: number;
  y: number;
}

/** Content revealed in the info drawer when a POI is opened. */
export interface POIDetails {
  heading: string;
  body: string;
  images?: string[];
}

/** A single interactive point of interest on a project scene. */
export interface PointOfInterest {
  id: string;
  title: string;
  description: string;
  position: POIPosition;
  type: POIType;
  details: POIDetails;
  /** Keys of mood-board items this POI highlights. */
  moodBoardItems?: string[];
  /** Droplet diameter in px. */
  radius: number;
  /** Glow strength multiplier (0.5–2.0). */
  glowIntensity: number;
}

/**
 * Core data model for the smoke viewer.
 *
 * The 3D map is a navigation shell; this dataset is the actual product.
 * Coordinates are stored in the viewer's own world space (Three.js, Y-up),
 * already converted from Source 2 units at asset-export time.
 */

/** A point in the viewer's world space (Three.js, Y-up, metres). */
export type Vec3 = [x: number, y: number, z: number]

/** How the player releases the smoke. Drives the icon/label in the UI. */
export type ThrowTechnique =
  | 'standing'
  | 'jumpthrow'
  | 'running'
  | 'run-jumpthrow'
  | 'walk'
  | 'crouch'

/** Which mouse buttons to hold/tap when throwing. */
export type ThrowInput =
  | 'left' // standard throw
  | 'right' // lob / underhand
  | 'both' // short throw

/** A single way to land a given smoke: where you stand and how you throw. */
export interface Lineup {
  id: string
  /** Optional short label, e.g. "From T spawn" or "One-way". */
  name?: string
  /** Where the player stands to throw from. */
  throwPosition: Vec3
  /** Direction the player should be roughly facing (for marker orientation). */
  facing?: Vec3
  technique: ThrowTechnique
  input: ThrowInput
  /** Requires a jumpthrow bind / can't be done by hand. */
  needsBind?: boolean
  /** Path under /public/instructions, e.g. "mirage/ct-smoke-from-tspawn.jpg". */
  instructionImage: string
  /** Human-readable step-by-step / aim description. */
  instructionText: string
  /** Free-form tags: "fast", "pro", "lurk", etc. */
  tags?: string[]
}

/** A place a smoke can land. The primary clickable target on the map. */
export interface SmokeSpot {
  id: string
  /** Display name, e.g. "CT", "Window", "Stairs". */
  name: string
  /** Where the smoke comes to rest in the world. */
  landingPosition: Vec3
  /** Optional callout area / site grouping, e.g. "A", "B", "Mid". */
  area?: string
  /** Ways to throw this smoke. */
  lineups: Lineup[]
}

/** Camera framing preset for a map (angled top-down by default). */
export interface CameraPreset {
  position: Vec3
  target: Vec3
}

export interface GameMap {
  id: string
  /** Display name, e.g. "Mirage". */
  name: string
  /** Path under /public/models, e.g. "mirage.glb". */
  modelPath: string
  /** Default camera framing when the map loads. */
  defaultCamera: CameraPreset
  spots: SmokeSpot[]
}

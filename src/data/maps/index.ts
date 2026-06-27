import type { GameMap } from '../../types/lineup'
import { mirage } from './mirage'

/** All maps known to the viewer, keyed by id. Add new maps here. */
export const MAPS: Record<string, GameMap> = {
  [mirage.id]: mirage,
}

export const DEFAULT_MAP_ID = mirage.id

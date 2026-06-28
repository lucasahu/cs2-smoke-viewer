/**
 * The active competitive map pool, in display order. Availability is derived
 * from whether the map has a data module registered in MAPS, so a map lights
 * up automatically once its lineups/radar are added.
 */
export interface PoolMap {
  id: string
  name: string
}

export const MAP_POOL: PoolMap[] = [
  { id: 'mirage', name: 'Mirage' },
  { id: 'inferno', name: 'Inferno' },
  { id: 'ancient', name: 'Ancient' },
  { id: 'anubis', name: 'Anubis' },
  { id: 'nuke', name: 'Nuke' },
  { id: 'dust2', name: 'Dust 2' },
  { id: 'cache', name: 'Cache' },
]

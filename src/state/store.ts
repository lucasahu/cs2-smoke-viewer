import { create } from 'zustand'
import { DEFAULT_MAP_ID, MAPS } from '../data/maps'
import type { GameMap, Lineup, SmokeSpot, Vec3 } from '../types/lineup'

interface ViewerState {
  mapId: string
  /** Currently selected smoke landing spot. */
  selectedSpotId: string | null
  /** Currently selected lineup within the selected spot. */
  selectedLineupId: string | null
  /** Author mode: click the scene to capture coordinates. */
  authorMode: boolean
  /** Last world position captured in author mode (raw click). */
  capturedPoint: Vec3 | null

  // selectors
  map: () => GameMap
  selectedSpot: () => SmokeSpot | null
  selectedLineup: () => Lineup | null

  // actions
  setMap: (mapId: string) => void
  selectSpot: (spotId: string | null) => void
  selectLineup: (lineupId: string | null) => void
  toggleAuthorMode: () => void
  capturePoint: (point: Vec3) => void
}

export const useViewer = create<ViewerState>((set, get) => ({
  mapId: DEFAULT_MAP_ID,
  selectedSpotId: null,
  selectedLineupId: null,
  authorMode: false,
  capturedPoint: null,

  map: () => MAPS[get().mapId],
  selectedSpot: () => {
    const { selectedSpotId } = get()
    if (!selectedSpotId) return null
    return get().map().spots.find((s) => s.id === selectedSpotId) ?? null
  },
  selectedLineup: () => {
    const { selectedLineupId } = get()
    const spot = get().selectedSpot()
    if (!spot || !selectedLineupId) return null
    return spot.lineups.find((l) => l.id === selectedLineupId) ?? null
  },

  setMap: (mapId) =>
    set({ mapId, selectedSpotId: null, selectedLineupId: null }),
  selectSpot: (spotId) =>
    set({ selectedSpotId: spotId, selectedLineupId: null }),
  selectLineup: (lineupId) => set({ selectedLineupId: lineupId }),
  toggleAuthorMode: () =>
    set((s) => ({ authorMode: !s.authorMode, capturedPoint: null })),
  capturePoint: (point) => set({ capturedPoint: point }),
}))

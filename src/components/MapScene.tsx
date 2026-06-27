import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useViewer } from '../state/store'
import { LineupMarker } from './LineupMarker'
import { MapModel } from './MapModel'
import { SmokeSpotMarker } from './SmokeSpotMarker'

const round = (n: number) => Math.round(n * 100) / 100

/** The 3D viewport: map geometry, smoke spots, and (when selected) lineups. */
export function MapScene() {
  const map = useViewer((s) => s.map())
  const side = useViewer((s) => s.side)
  const selectedSpotId = useViewer((s) => s.selectedSpotId)
  const selectedLineupId = useViewer((s) => s.selectedLineupId)
  const authorMode = useViewer((s) => s.authorMode)
  const selectSpot = useViewer((s) => s.selectSpot)
  const selectLineup = useViewer((s) => s.selectLineup)
  const capturePoint = useViewer((s) => s.capturePoint)

  const selectedSpot = map.spots.find((s) => s.id === selectedSpotId) ?? null
  const markerScale = map.markerScale ?? 1

  // Only show spots that have a lineup on the active side, and only that
  // side's lineups within the selected spot.
  const visibleSpots = map.spots.filter((s) =>
    s.lineups.some((l) => l.side === side),
  )
  const visibleLineups = selectedSpot
    ? selectedSpot.lineups.filter((l) => l.side === side)
    : []

  const handleSurfaceClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const { x, y, z } = e.point
    // Round for cleaner numbers when copying into a data file.
    capturePoint([round(x), round(y), round(z)])
  }

  return (
    <Canvas
      camera={{ position: map.defaultCamera.position, fov: 50, near: 1, far: 20000 }}
    >
      <color attach="background" args={['#0e1116']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 40, 20]} intensity={1.2} />

      <MapModel onSurfaceClick={handleSurfaceClick} />

      {/* Smoke landing spots: collapse to just the selected one once drilled in. */}
      {(selectedSpot ? [selectedSpot] : visibleSpots).map((spot) => (
        <SmokeSpotMarker
          key={spot.id}
          spot={spot}
          selected={spot.id === selectedSpotId}
          onSelect={() => selectSpot(spot.id)}
          scale={markerScale}
        />
      ))}

      {/* Throw positions for the selected spot (active side only). */}
      {visibleLineups.map((lineup) => (
        <LineupMarker
          key={lineup.id}
          lineup={lineup}
          selected={lineup.id === selectedLineupId}
          onSelect={() => selectLineup(lineup.id)}
          scale={markerScale}
        />
      ))}

      <OrbitControls
        target={map.defaultCamera.target}
        makeDefault
        enabled={!authorMode}
      />
    </Canvas>
  )
}

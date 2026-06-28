import { Line, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import type { Vec3 } from '../types/lineup'
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
  const selectedLineup =
    visibleLineups.find((l) => l.id === selectedLineupId) ?? null

  // Lift trajectory endpoints slightly off the ground so the line doesn't
  // z-fight with the radar plane.
  const lift = ([x, y, z]: Vec3): Vec3 => [x, y + 8, z]

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

      {/* Trajectory: dashed line from the selected throw spot to the smoke. */}
      {selectedLineup && selectedSpot && (
        <Line
          points={[
            lift(selectedLineup.throwPosition),
            lift(selectedSpot.landingPosition),
          ]}
          color="#52e07a"
          lineWidth={5}
          dashed
          dashSize={70}
          gapSize={28}
        />
      )}

      {/* Smoke landing spots: collapse to just the selected one once drilled in. */}
      {(selectedSpot ? [selectedSpot] : visibleSpots).map((spot) => (
        <SmokeSpotMarker
          key={spot.id}
          spot={spot}
          selected={spot.id === selectedSpotId}
          onSelect={() =>
            selectSpot(spot.id === selectedSpotId ? null : spot.id)
          }
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

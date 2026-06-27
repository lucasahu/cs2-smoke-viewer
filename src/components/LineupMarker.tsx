import { Html } from '@react-three/drei'
import type { Lineup } from '../types/lineup'

interface LineupMarkerProps {
  lineup: Lineup
  selected: boolean
  onSelect: () => void
}

/** A throw-position marker, shown once a smoke spot is selected. */
export function LineupMarker({ lineup, selected, onSelect }: LineupMarkerProps) {
  return (
    <group position={lineup.throwPosition}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <coneGeometry args={[0.8, 1.6, 4]} />
        <meshStandardMaterial
          color={selected ? '#ff6b6b' : '#90be6d'}
          emissive={selected ? '#ff6b6b' : '#90be6d'}
          emissiveIntensity={selected ? 0.6 : 0.2}
        />
      </mesh>
      <Html distanceFactor={40} position={[0, 1.4, 0]} center>
        <div className="marker-label small">{lineup.name ?? lineup.technique}</div>
      </Html>
    </group>
  )
}

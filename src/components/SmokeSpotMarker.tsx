import { Html } from '@react-three/drei'
import type { SmokeSpot } from '../types/lineup'

interface SmokeSpotMarkerProps {
  spot: SmokeSpot
  selected: boolean
  onSelect: () => void
  /** Uniform marker size (scales geometry + label offset, not the position). */
  scale?: number
}

/** A clickable smoke landing target floating over its world position. */
export function SmokeSpotMarker({
  spot,
  selected,
  onSelect,
  scale = 1,
}: SmokeSpotMarkerProps) {
  return (
    <group position={spot.landingPosition} scale={scale}>
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
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={selected ? '#ffd166' : '#4cc9f0'}
          emissive={selected ? '#ffd166' : '#4cc9f0'}
          emissiveIntensity={selected ? 0.6 : 0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <Html distanceFactor={40} position={[0, 1.6, 0]} center>
        <div className="marker-label">{spot.name}</div>
      </Html>
    </group>
  )
}

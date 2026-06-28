import { BackSide } from 'three'
import type { SmokeSpot } from '../types/lineup'

interface SmokeSpotMarkerProps {
  spot: SmokeSpot
  selected: boolean
  onSelect: () => void
  /** Uniform marker size (scales geometry + label offset, not the position). */
  scale?: number
}

/**
 * Lumps making up the cartoon cloud, as [x, y, z, radius] in local space.
 * Spread mostly across X/Z (the cloud is seen from above) with a couple of
 * higher lumps so it puffs up into 3D.
 */
const BUMPS: [number, number, number, number][] = [
  [0, 0, 0, 1.25],
  [-1.45, -0.1, 0.1, 0.85],
  [1.45, -0.1, 0.1, 0.85],
  [-0.7, 0.1, -0.55, 0.85],
  [0.75, 0.1, -0.5, 0.9],
  [0, -0.1, 0.5, 0.95],
  [-0.2, 0.55, 0.05, 0.75],
]

const OUTLINE = 1.12 // dark inverted-hull shell scale

/** A clickable smoke landing target, drawn as a 3D cartoon cloud. */
export function SmokeSpotMarker({
  spot,
  selected,
  onSelect,
  scale = 1,
}: SmokeSpotMarkerProps) {
  const fill = selected ? '#52e07a' : '#f3f6fb'

  return (
    <group position={spot.landingPosition} scale={scale}>
      {/* Invisible hit target. */}
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
        <sphereGeometry args={[2.2, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Dark outline: back-face shell slightly larger than each lump. */}
      {BUMPS.map(([x, y, z, r], i) => (
        <mesh key={`o${i}`} position={[x, y, z]} scale={OUTLINE}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshBasicMaterial color="#2b3340" side={BackSide} />
        </mesh>
      ))}

      {/* Solid toon-shaded body. */}
      {BUMPS.map(([x, y, z, r], i) => (
        <mesh key={`f${i}`} position={[x, y, z]}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshToonMaterial color={fill} />
        </mesh>
      ))}
    </group>
  )
}

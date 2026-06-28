import { Html } from '@react-three/drei'
import type { Lineup } from '../types/lineup'

interface LineupMarkerProps {
  lineup: Lineup
  selected: boolean
  onSelect: () => void
  /** Uniform marker size (scales geometry + label offset, not the position). */
  scale?: number
}

/**
 * A throw-position marker, shown once a smoke spot is selected.
 *
 * Rendered as a flat stick person lying on the ground plane (the map is viewed
 * straight down, so an upright figure wouldn't read). Gray + translucent by
 * default, solid green when selected.
 */
export function LineupMarker({
  lineup,
  selected,
  onSelect,
  scale = 1,
}: LineupMarkerProps) {
  const color = selected ? '#52e07a' : '#7ec8f0'
  const emissiveIntensity = selected ? 0.6 : 0.25

  const material = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={emissiveIntensity}
    />
  )

  const limb = 0.09 // stick thickness

  return (
    <group position={lineup.throwPosition} scale={scale}>
      {/* Lay the figure flat on the XZ ground plane. */}
      <group
        scale={2}
        rotation={[-Math.PI / 2, 0, 0]}
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
        {/* Head */}
        <mesh position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.26, 16, 16]} />
          {material}
        </mesh>
        {/* Torso */}
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[limb, limb, 0.7, 8]} />
          {material}
        </mesh>
        {/* Arms (one bar across the shoulders) */}
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[limb, limb, 0.8, 8]} />
          {material}
        </mesh>
        {/* Left leg */}
        <mesh position={[-0.14, -0.58, 0]} rotation={[0, 0, 0.28]}>
          <cylinderGeometry args={[limb, limb, 0.66, 8]} />
          {material}
        </mesh>
        {/* Right leg */}
        <mesh position={[0.14, -0.58, 0]} rotation={[0, 0, -0.28]}>
          <cylinderGeometry args={[limb, limb, 0.66, 8]} />
          {material}
        </mesh>
      </group>
      <Html distanceFactor={40} position={[0, 1.4, 0]} center>
        <div className="marker-label small">{lineup.name ?? lineup.technique}</div>
      </Html>
    </group>
  )
}

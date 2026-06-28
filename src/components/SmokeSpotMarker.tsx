import type { SmokeSpot } from '../types/lineup'
import { GRENADE_COLOR, GrenadeIcon } from './MarkerIcons'

interface SmokeSpotMarkerProps {
  spot: SmokeSpot
  selected: boolean
  onSelect: () => void
  /** Uniform marker size (scales geometry + label offset, not the position). */
  scale?: number
}

/** A clickable grenade spot, drawn as a cartoon 3D icon for its grenade type. */
export function SmokeSpotMarker({
  spot,
  selected,
  onSelect,
  scale = 1,
}: SmokeSpotMarkerProps) {
  const fill = selected ? '#52e07a' : GRENADE_COLOR[spot.grenade]

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

      <GrenadeIcon grenade={spot.grenade} fill={fill} />
    </group>
  )
}

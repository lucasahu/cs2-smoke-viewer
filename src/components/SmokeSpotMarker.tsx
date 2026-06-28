import { Billboard } from '@react-three/drei'
import type { SmokeSpot } from '../types/lineup'
import { GrenadeIcon } from './MarkerIcons'

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

      {/* Always face the camera, even as the map is orbited. */}
      <Billboard>
        <GrenadeIcon grenade={spot.grenade} selected={selected} />
      </Billboard>
    </group>
  )
}

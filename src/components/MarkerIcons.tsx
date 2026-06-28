import { useMemo, type ReactElement } from 'react'
import { BackSide, Shape } from 'three'
import type { Grenade } from '../types/lineup'

const OUTLINE_COLOR = '#2b3340'
const OUTLINE = 1.12

type Vec3 = [number, number, number]

/** Default (unselected) themed colour per grenade type. */
export const GRENADE_COLOR: Record<Grenade, string> = {
  smoke: '#f3f6fb',
  molly: '#e8743a',
  flash: '#cfe4f5',
  he: '#d9533c',
}

interface OutlinedProps {
  /** A geometry element, e.g. <sphereGeometry args={[1, 16, 16]} />. */
  geo: ReactElement
  fill: string
  position?: Vec3
  rotation?: Vec3
  scale?: number | Vec3
}

/** A toon-shaded body with a dark inverted-hull outline behind it. */
function Outlined({ geo, fill, position, rotation, scale = 1 }: OutlinedProps) {
  const outlineScale: number | Vec3 = Array.isArray(scale)
    ? [scale[0] * OUTLINE, scale[1] * OUTLINE, scale[2] * OUTLINE]
    : scale * OUTLINE
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={outlineScale}>
        {geo}
        <meshBasicMaterial color={OUTLINE_COLOR} side={BackSide} />
      </mesh>
      <mesh scale={scale}>
        {geo}
        <meshToonMaterial color={fill} />
      </mesh>
    </group>
  )
}

/** A flat dark detail bit (no outline), e.g. an iris. */
function Detail({ geo, position }: { geo: ReactElement; position?: Vec3 }) {
  return (
    <mesh position={position}>
      {geo}
      <meshToonMaterial color={OUTLINE_COLOR} />
    </mesh>
  )
}

const CLOUD_BUMPS: [number, number, number, number][] = [
  [0, 0, 0, 1.25],
  [-1.45, -0.1, 0.1, 0.85],
  [1.45, -0.1, 0.1, 0.85],
  [-0.7, 0.1, -0.55, 0.85],
  [0.75, 0.1, -0.5, 0.9],
  [0, -0.1, 0.5, 0.95],
  [-0.2, 0.55, 0.05, 0.75],
]

function CloudIcon({ fill }: { fill: string }) {
  return (
    <>
      {CLOUD_BUMPS.map(([x, y, z, r], i) => (
        <Outlined
          key={i}
          geo={<sphereGeometry args={[r, 16, 16]} />}
          fill={fill}
          position={[x, y, z]}
        />
      ))}
    </>
  )
}

const FLAME_EXTRUDE = {
  depth: 0.7,
  bevelEnabled: true,
  bevelThickness: 0.28,
  bevelSize: 0.28,
  bevelSegments: 4,
  steps: 1,
  curveSegments: 24,
}

/** Classic flame silhouette (pointing +Y), roughly centred on the origin. */
function makeFlameShape(): Shape {
  const s = new Shape()
  s.moveTo(0, -1.6)
  // right side, bulging out then curling in
  s.bezierCurveTo(1.0, -1.6, 1.3, -0.8, 1.18, -0.1)
  s.bezierCurveTo(1.06, 0.5, 0.45, 0.6, 0.62, 1.05)
  s.bezierCurveTo(0.72, 1.45, 0.28, 1.55, 0.0, 1.95)
  // left side, mirrored
  s.bezierCurveTo(-0.28, 1.55, -0.72, 1.45, -0.62, 1.05)
  s.bezierCurveTo(-0.45, 0.6, -1.06, 0.5, -1.18, -0.1)
  s.bezierCurveTo(-1.3, -0.8, -1.0, -1.6, 0, -1.6)
  return s
}

function FlameIcon({ fill }: { fill: string }) {
  const shape = useMemo(makeFlameShape, [])
  return (
    // Laid flat so the silhouette faces the straight-down camera.
    <Outlined
      geo={<extrudeGeometry args={[shape, FLAME_EXTRUDE]} />}
      fill={fill}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={0.95}
    />
  )
}

function EyeIcon({ fill }: { fill: string }) {
  return (
    <>
      {/* Wide almond eyeball */}
      <Outlined
        geo={<sphereGeometry args={[1, 24, 24]} />}
        fill={fill}
        scale={[1.5, 0.65, 1.05]}
      />
      {/* Iris / pupil on top, facing the camera */}
      <Detail
        geo={<sphereGeometry args={[0.46, 20, 20]} />}
        position={[0, 0.45, 0]}
      />
      {/* Cartoon glint */}
      <mesh position={[0.2, 0.62, 0.15]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  )
}

function ExplosionIcon({ fill }: { fill: string }) {
  const spikes = 9
  return (
    <>
      {/* Core */}
      <Outlined geo={<sphereGeometry args={[0.95, 20, 20]} />} fill={fill} />
      {/* Radial spikes alternating in length for a jagged starburst */}
      {Array.from({ length: spikes }, (_, i) => {
        const theta = (i / spikes) * Math.PI * 2
        const len = i % 2 === 0 ? 1.7 : 1.1
        const dist = 0.4 + len / 2
        return (
          <group key={i} rotation={[0, theta, 0]}>
            <Outlined
              geo={<coneGeometry args={[0.45, len, 10]} />}
              fill={fill}
              position={[dist, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]}
            />
          </group>
        )
      })}
    </>
  )
}

/** Picks the cartoon 3D icon for a grenade type. */
export function GrenadeIcon({
  grenade,
  fill,
}: {
  grenade: Grenade
  fill: string
}) {
  switch (grenade) {
    case 'molly':
      return <FlameIcon fill={fill} />
    case 'flash':
      return <EyeIcon fill={fill} />
    case 'he':
      return <ExplosionIcon fill={fill} />
    case 'smoke':
    default:
      return <CloudIcon fill={fill} />
  }
}

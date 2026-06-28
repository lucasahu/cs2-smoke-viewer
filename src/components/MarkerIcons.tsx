import { useMemo, type ReactElement } from 'react'
import { BackSide, Path, Shape } from 'three'
import type { Grenade } from '../types/lineup'

const OUTLINE_COLOR = '#2b3340'
const OUTLINE = 1.12

type Vec3 = [number, number, number]

/** Default (unselected) cloud colour; the other icons carry their own palettes. */
const SMOKE_COLOR = '#f3f6fb'
const SELECTED = '#52e07a'

// Green shades reused when a multi-colour icon is selected (dark -> light).
const GREEN3 = ['#2f8f4e', '#46b06a', '#86e0a6']

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

interface OutlinedProps {
  geo: ReactElement
  fill: string
  position?: Vec3
  rotation?: Vec3
  scale?: number | Vec3
}

/** A toon-shaded body with a dark inverted-hull outline (used by the cloud). */
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

interface LayerProps {
  geo: ReactElement
  color: string
  position?: Vec3
  rotation?: Vec3
  scale?: number | Vec3
}

/** A single smooth-shaded colour layer (no outline); icons stack these. */
function Layer({ geo, color, position, rotation, scale }: LayerProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {geo}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.18}
        roughness={0.55}
        metalness={0}
      />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Smoke — cartoon cloud (unchanged)
// ---------------------------------------------------------------------------

const CLOUD_BUMPS: [number, number, number, number][] = [
  [0, 0, 0, 1.25],
  [-1.45, -0.1, 0.1, 0.85],
  [1.45, -0.1, 0.1, 0.85],
  [-0.7, 0.1, -0.55, 0.85],
  [0.75, 0.1, -0.5, 0.9],
  [0, -0.1, 0.5, 0.95],
  [-0.2, 0.55, 0.05, 0.75],
]

function CloudIcon({ selected }: { selected: boolean }) {
  const fill = selected ? SELECTED : SMOKE_COLOR
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

// ---------------------------------------------------------------------------
// Molly — layered flame (red -> orange -> yellow)
// ---------------------------------------------------------------------------

const FLAME_EXTRUDE = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.18,
  bevelSize: 0.18,
  bevelSegments: 4,
  steps: 1,
  curveSegments: 24,
}

/** Classic flame silhouette (pointing +Y), roughly centred on the origin. */
function makeFlameShape(): Shape {
  const s = new Shape()
  s.moveTo(0, -1.6)
  s.bezierCurveTo(1.0, -1.6, 1.3, -0.8, 1.18, -0.1)
  s.bezierCurveTo(1.06, 0.5, 0.45, 0.6, 0.62, 1.05)
  s.bezierCurveTo(0.72, 1.45, 0.28, 1.55, 0.0, 1.95)
  s.bezierCurveTo(-0.28, 1.55, -0.72, 1.45, -0.62, 1.05)
  s.bezierCurveTo(-0.45, 0.6, -1.06, 0.5, -1.18, -0.1)
  s.bezierCurveTo(-1.3, -0.8, -1.0, -1.6, 0, -1.6)
  return s
}

function FlameIcon({ selected }: { selected: boolean }) {
  const shape = useMemo(makeFlameShape, [])
  const c = selected ? GREEN3 : ['#c0492f', '#d9772e', '#e8c83f']
  const geo = <extrudeGeometry args={[shape, FLAME_EXTRUDE]} />
  return (
    <group scale={0.95}>
      <Layer geo={geo} color={c[0]} />
      <Layer geo={geo} color={c[1]} position={[0, -0.4, 0.32]} scale={0.62} />
      <Layer geo={geo} color={c[2]} position={[0, -0.6, 0.64]} scale={0.38} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Flash — eye (dark almond lens + white iris ring)
// ---------------------------------------------------------------------------

const EYE_EXTRUDE = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.16,
  bevelSize: 0.16,
  bevelSegments: 4,
  steps: 1,
  curveSegments: 24,
}

/**
 * A hollow almond eyelid: a pointed lens silhouette with a smaller almond hole
 * cut out, so the gap inside reads as empty (eyelid -> transparent ring -> iris).
 */
function makeEyelidShape(): Shape {
  const s = new Shape()
  s.moveTo(-1.2, 0)
  s.quadraticCurveTo(0, 0.74, 1.2, 0)
  s.quadraticCurveTo(0, -0.74, -1.2, 0)

  const hole = new Path()
  hole.moveTo(-0.74, 0)
  hole.quadraticCurveTo(0, 0.58, 0.74, 0)
  hole.quadraticCurveTo(0, -0.58, -0.74, 0)
  s.holes.push(hole)
  return s
}

function EyeIcon({ selected }: { selected: boolean }) {
  const eyelid = useMemo(makeEyelidShape, [])
  const white = selected ? SELECTED : '#f4f4f4'
  return (
    <group scale={1.1}>
      {/* Hollow eyelid: solid band with an open (transparent) centre */}
      <Outlined geo={<extrudeGeometry args={[eyelid, EYE_EXTRUDE]} />} fill={white} />
      {/* White iris dot floating in the open centre */}
      <Outlined
        geo={<sphereGeometry args={[0.26, 18, 18]} />}
        fill={white}
        position={[0, 0, 0.4]}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// HE — jagged explosion star (two-tone)
// ---------------------------------------------------------------------------

const STAR_EXTRUDE = {
  depth: 0.4,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.08,
  bevelSegments: 2,
  steps: 1,
  curveSegments: 1,
}

/** A spiky star with deterministic per-point jitter for an explosive look. */
function makeStar(points: number, rOuter: number, rInner: number, seed = 0): Shape {
  const s = new Shape()
  const n = points * 2
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2
    const jitter = 0.82 + 0.34 * (((i + seed) * 0.61803398875) % 1)
    const r = (i % 2 === 0 ? rOuter : rInner) * jitter
    const x = Math.cos(ang) * r
    const y = Math.sin(ang) * r
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  return s
}

function ExplosionIcon({ selected }: { selected: boolean }) {
  const outer = useMemo(() => makeStar(11, 1.7, 0.78, 1), [])
  const inner = useMemo(() => makeStar(11, 1.12, 0.5, 4), [])
  const c = selected ? [GREEN3[0], GREEN3[2]] : ['#b5611f', '#e8c33f']
  return (
    <group scale={0.95}>
      <Layer geo={<extrudeGeometry args={[outer, STAR_EXTRUDE]} />} color={c[0]} />
      <Layer
        geo={<extrudeGeometry args={[inner, STAR_EXTRUDE]} />}
        color={c[1]}
        position={[0, 0, 0.3]}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------

/** Picks the cartoon 3D icon for a grenade type. */
export function GrenadeIcon({
  grenade,
  selected,
}: {
  grenade: Grenade
  selected: boolean
}) {
  switch (grenade) {
    case 'molly':
      return <FlameIcon selected={selected} />
    case 'flash':
      return <EyeIcon selected={selected} />
    case 'he':
      return <ExplosionIcon selected={selected} />
    case 'smoke':
    default:
      return <CloudIcon selected={selected} />
  }
}

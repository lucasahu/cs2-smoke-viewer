import { Grid, useGLTF, useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
import { SRGBColorSpace } from 'three'
import { useViewer } from '../state/store'
import type { RadarSource } from '../types/lineup'

type SurfaceClick = ((e: ThreeEvent<MouseEvent>) => void) | undefined

interface MapModelProps {
  /** Fired when the map surface is clicked (used by author mode). */
  onSurfaceClick?: (e: ThreeEvent<MouseEvent>) => void
}

/**
 * The map surface. Priority: decompiled `.glb` > 2D radar plane > grid.
 *
 * - `modelPath` set  -> render the real geometry (the migration target).
 * - `radar` set      -> render the overview image as a flat, world-scaled plane.
 * - neither / error  -> placeholder grid, so the app always runs.
 *
 * All three are click targets for author-mode coordinate capture.
 */
export function MapModel({ onSurfaceClick }: MapModelProps) {
  const authorMode = useViewer((s) => s.authorMode)
  const map = useViewer((s) => s.map())
  const handleClick: SurfaceClick = authorMode ? onSurfaceClick : undefined
  const fallback = <PlaceholderGround onClick={handleClick} />

  let content: ReactNode = fallback
  if (map.modelPath) {
    content = <GltfMap path={`/models/${map.modelPath}`} onClick={handleClick} />
  } else if (map.radar) {
    content = <RadarPlane radar={map.radar} onClick={handleClick} />
  }

  return (
    <MapErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>{content}</Suspense>
    </MapErrorBoundary>
  )
}

/** Loads and displays the decompiled map model. */
function GltfMap({ path, onClick }: { path: string; onClick: SurfaceClick }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} onClick={onClick} />
}

/**
 * The radar overview as a flat plane in real game world units.
 *
 * Layout from the overview file: the image's left edge sits at world X = posX
 * and its top edge at world Y = posY, spanning `overviewSizePx * scale` units
 * each way. We map game X -> world X and game Y -> world -Z (Three.js Y-up),
 * so the plane lies on the ground and clicks read back as game coordinates.
 */
function RadarPlane({
  radar,
  onClick,
}: {
  radar: RadarSource
  onClick: SurfaceClick
}) {
  const tex = useTexture(`/radar/${radar.image}`)
  tex.colorSpace = SRGBColorSpace

  const ext = radar.overviewSizePx * radar.scale
  const centerX = radar.posX + ext / 2
  const centerZ = -radar.posY + ext / 2

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[centerX, 0, centerZ]}
      onClick={onClick}
    >
      <planeGeometry args={[ext, ext]} />
      <meshBasicMaterial map={tex} toneMapped={false} transparent />
    </mesh>
  )
}

/** Flat ground + grid shown until real geometry is available. */
function PlaceholderGround({ onClick }: { onClick: SurfaceClick }) {
  return (
    <group>
      {/* Invisible-ish ground: receives raycasts for author-mode capture. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1b1f27" />
      </mesh>
      <Grid
        args={[200, 200]}
        cellSize={2}
        cellColor="#2a2f3a"
        sectionSize={10}
        sectionColor="#3a4150"
        fadeDistance={120}
        infiniteGrid
      />
    </group>
  )
}

/** Falls back to the placeholder if the asset is missing or fails to parse. */
class MapErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

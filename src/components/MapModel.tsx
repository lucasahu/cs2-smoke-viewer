import { Grid, useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
import { useViewer } from '../state/store'

type SurfaceClick = ((e: ThreeEvent<MouseEvent>) => void) | undefined

interface MapModelProps {
  /** Fired when the map surface is clicked (used by author mode). */
  onSurfaceClick?: (e: ThreeEvent<MouseEvent>) => void
}

/**
 * The map geometry.
 *
 * Renders the decompiled `public/models/<map>.glb` if it exists, and falls
 * back to a placeholder grid otherwise — so the app runs before any assets
 * are extracted, and "just works" the moment you drop the .glb in (reload).
 *
 * See README "Asset pipeline" for how to produce the .glb.
 */
export function MapModel({ onSurfaceClick }: MapModelProps) {
  const authorMode = useViewer((s) => s.authorMode)
  const modelPath = useViewer((s) => s.map().modelPath)
  const handleClick: SurfaceClick = authorMode ? onSurfaceClick : undefined
  const fallback = <PlaceholderGround onClick={handleClick} />

  return (
    <MapErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GltfMap path={`/models/${modelPath}`} onClick={handleClick} />
      </Suspense>
    </MapErrorBoundary>
  )
}

/** Loads and displays the decompiled map model. */
function GltfMap({ path, onClick }: { path: string; onClick: SurfaceClick }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} onClick={onClick} />
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

/** Falls back to the placeholder if the .glb is missing or fails to parse. */
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

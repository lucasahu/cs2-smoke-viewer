import { Grid } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useViewer } from '../state/store'

interface MapModelProps {
  /** Fired when the map surface is clicked (used by author mode). */
  onSurfaceClick?: (e: ThreeEvent<MouseEvent>) => void
}

/**
 * The map geometry.
 *
 * Currently a placeholder grid + ground plane so the app runs without assets.
 * Once you have a decompiled, decimated `public/models/<map>.glb`, swap the
 * placeholder for drei's <useGLTF>:
 *
 *   const { scene } = useGLTF(`/models/${map.modelPath}`)
 *   return <primitive object={scene} onClick={onSurfaceClick} />
 *
 * Wrap the Canvas content in <Suspense> when you do (see MapScene).
 */
export function MapModel({ onSurfaceClick }: MapModelProps) {
  const authorMode = useViewer((s) => s.authorMode)

  return (
    <group>
      {/* Invisible ground plane: receives raycasts for author-mode capture. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={authorMode ? onSurfaceClick : undefined}
      >
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

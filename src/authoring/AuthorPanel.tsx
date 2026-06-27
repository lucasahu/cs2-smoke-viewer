import { useViewer } from '../state/store'

/**
 * Author mode (stub).
 *
 * Toggle it on, then click anywhere on the map surface to capture a world
 * coordinate. The captured Vec3 is shown here ready to paste into a map data
 * file (e.g. src/data/maps/mirage.ts) as a landingPosition or throwPosition.
 *
 * Next steps to flesh this out:
 *  - Form fields to build a full Lineup (technique, input, image, text).
 *  - "Add as new spot" / "Add lineup to selected spot" buttons.
 *  - Export the in-memory map back to a .ts/.json file (download or copy).
 *  - Raycast against the real glb mesh instead of the ground plane.
 */
export function AuthorPanel() {
  const authorMode = useViewer((s) => s.authorMode)
  const toggle = useViewer((s) => s.toggleAuthorMode)
  const captured = useViewer((s) => s.capturedPoint)

  return (
    <div className="author">
      <button
        className={authorMode ? 'author-toggle active' : 'author-toggle'}
        onClick={toggle}
      >
        {authorMode ? '● Author mode ON' : 'Author mode'}
      </button>

      {authorMode && (
        <div className="author-body">
          <p className="hint">Click the map to capture a coordinate.</p>
          {captured ? (
            <code
              className="captured"
              onClick={() =>
                navigator.clipboard?.writeText(JSON.stringify(captured))
              }
              title="Click to copy"
            >
              [{captured.join(', ')}]
            </code>
          ) : (
            <p className="hint dim">No point captured yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

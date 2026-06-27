import { useViewer } from '../state/store'

/**
 * Right-hand panel. Walks the user through the funnel:
 *   pick a smoke spot -> pick a lineup -> see image + text instructions.
 */
export function InstructionPanel() {
  const map = useViewer((s) => s.map())
  const side = useViewer((s) => s.side)
  const selectedSpot = useViewer((s) => s.selectedSpot())
  const selectedLineup = useViewer((s) => s.selectedLineup())
  const selectSpot = useViewer((s) => s.selectSpot)
  const selectLineup = useViewer((s) => s.selectLineup)

  if (!selectedSpot) {
    return (
      <aside className="panel">
        <h2>{map.name}</h2>
        <p className="hint">
          {side} side — click a smoke spot on the map to see lineups.
        </p>
      </aside>
    )
  }

  const lineups = selectedSpot.lineups.filter((l) => l.side === side)

  if (!selectedLineup) {
    return (
      <aside className="panel">
        <button className="back" onClick={() => selectSpot(null)}>
          ← All spots
        </button>
        <h2>{selectedSpot.name}</h2>
        {lineups.length === 0 ? (
          <p className="hint">No {side}-side lineups for this spot yet.</p>
        ) : (
          <ul className="lineup-list">
            {lineups.map((l) => (
              <li key={l.id}>
                <button onClick={() => selectLineup(l.id)}>
                  <span>{l.name ?? l.technique}</span>
                  <span className="tag">{l.technique}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    )
  }

  return (
    <aside className="panel">
      <button className="back" onClick={() => selectLineup(null)}>
        ← {selectedSpot.name} lineups
      </button>
      <h2>{selectedLineup.name ?? selectedLineup.technique}</h2>
      <img
        className="instruction-img"
        src={`/instructions/${selectedLineup.instructionImage}`}
        alt={selectedLineup.instructionText}
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
      <div className="badges">
        <span className="tag">{selectedLineup.technique}</span>
        <span className="tag">{selectedLineup.input} click</span>
        {selectedLineup.needsBind && <span className="tag warn">needs bind</span>}
      </div>
      <p className="instruction-text">{selectedLineup.instructionText}</p>
    </aside>
  )
}

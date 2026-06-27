import { useViewer } from '../state/store'
import type { Side } from '../types/lineup'

const SIDES: Side[] = ['T', 'CT']

/** Segmented T/CT switch that drives which lineups are shown. */
export function SideToggle() {
  const side = useViewer((s) => s.side)
  const setSide = useViewer((s) => s.setSide)

  return (
    <div className="side-toggle" role="tablist" aria-label="Side">
      {SIDES.map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={side === s}
          className={`side-opt ${s.toLowerCase()} ${side === s ? 'active' : ''}`}
          onClick={() => setSide(s)}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

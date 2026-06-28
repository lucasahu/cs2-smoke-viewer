import { useViewer } from '../state/store'
import type { Grenade } from '../types/lineup'

const GRENADES: { id: Grenade; label: string }[] = [
  { id: 'smoke', label: 'Smoke' },
  { id: 'molly', label: 'Molly' },
  { id: 'flash', label: 'Flash' },
  { id: 'he', label: 'HE' },
]

/** Segmented switch picking which grenade type's spots are shown. */
export function GrenadeToggle() {
  const grenade = useViewer((s) => s.grenade)
  const setGrenade = useViewer((s) => s.setGrenade)

  return (
    <div className="nade-toggle" role="tablist" aria-label="Grenade">
      {GRENADES.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={grenade === id}
          className={`nade-opt ${id} ${grenade === id ? 'active' : ''}`}
          onClick={() => setGrenade(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

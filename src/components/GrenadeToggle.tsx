import { useViewer } from '../state/store'
import type { Grenade } from '../types/lineup'
import { SegmentedToggle, type SegOption } from './SegmentedToggle'

const GRENADE_OPTIONS: SegOption[] = [
  { id: 'smoke', label: 'Smoke', color: '#c7cdd6' },
  { id: 'molly', label: 'Molly', color: '#e0683a' },
  { id: 'flash', label: 'Flash', color: '#e8d44a' },
  { id: 'he', label: 'HE', color: '#6fae54' },
]

/** Segmented switch picking which grenade type's spots are shown. */
export function GrenadeToggle() {
  const grenade = useViewer((s) => s.grenade)
  const setGrenade = useViewer((s) => s.setGrenade)

  return (
    <SegmentedToggle
      ariaLabel="Grenade"
      options={GRENADE_OPTIONS}
      value={grenade}
      onChange={(id) => setGrenade(id as Grenade)}
    />
  )
}

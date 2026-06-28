import { useViewer } from '../state/store'
import type { Side } from '../types/lineup'
import { SegmentedToggle, type SegOption } from './SegmentedToggle'

const SIDE_OPTIONS: SegOption[] = [
  { id: 'T', label: 'T', color: '#e8a13a' },
  { id: 'CT', label: 'CT', color: '#5a9fe0' },
]

/** Segmented T/CT switch that drives which lineups are shown. */
export function SideToggle() {
  const side = useViewer((s) => s.side)
  const setSide = useViewer((s) => s.setSide)

  return (
    <SegmentedToggle
      ariaLabel="Side"
      options={SIDE_OPTIONS}
      value={side}
      onChange={(id) => setSide(id as Side)}
    />
  )
}

import type { CSSProperties } from 'react'

export interface SegOption {
  id: string
  label: string
  /** Background colour of the sliding thumb when this option is active. */
  color: string
}

interface SegmentedToggleProps {
  options: SegOption[]
  value: string
  onChange: (id: string) => void
  ariaLabel: string
}

/**
 * A segmented pill control with a thumb that slides to the active option.
 * The thumb's colour follows the selected option.
 */
export function SegmentedToggle({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedToggleProps) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  )
  const active = options[index]

  return (
    <div
      className="seg"
      role="tablist"
      aria-label={ariaLabel}
      style={{ '--count': options.length, '--index': index } as CSSProperties}
    >
      <span className="seg-thumb" style={{ background: active.color }} />
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={o.id === value}
          className={`seg-opt ${o.id === value ? 'active' : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

import { MAPS } from '../data/maps'
import { MAP_POOL } from '../data/mapPool'
import { useViewer } from '../state/store'

/** Landing screen: pick a map from the active competitive pool. */
export function MapSelect() {
  const setMap = useViewer((s) => s.setMap)

  return (
    <div className="landing">
      <header className="landing-head">
        <span className="brand">CS2 Smoke Viewer</span>
        <p className="landing-sub">Select a map</p>
      </header>

      <div className="map-grid">
        {MAP_POOL.map((m) => {
          const available = m.id in MAPS
          return (
            <button
              key={m.id}
              className={`map-card ${available ? '' : 'disabled'}`}
              disabled={!available}
              onClick={() => setMap(m.id)}
            >
              <div
                className="map-thumb"
                style={
                  available
                    ? { backgroundImage: `url(/radar/${m.id}.png)` }
                    : undefined
                }
              />
              <span className="map-name">{m.name}</span>
              {!available && <span className="map-soon">Soon</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

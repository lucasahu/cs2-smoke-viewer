import { AuthorPanel } from './authoring/AuthorPanel'
import { GrenadeToggle } from './components/GrenadeToggle'
import { InstructionPanel } from './components/InstructionPanel'
import { MapScene } from './components/MapScene'
import { MapSelect } from './components/MapSelect'
import { SideToggle } from './components/SideToggle'
import { useViewer } from './state/store'

export default function App() {
  const mapId = useViewer((s) => s.mapId)
  const mapName = useViewer((s) => s.map().name)
  const clearMap = useViewer((s) => s.clearMap)

  if (!mapId) return <MapSelect />

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <button className="back-maps" onClick={clearMap}>
            ← Maps
          </button>
          <span className="brand">{mapName}</span>
          <SideToggle />
          <GrenadeToggle />
        </div>
        <AuthorPanel />
      </header>
      <main className="layout">
        <div className="viewport">
          <MapScene />
        </div>
        <InstructionPanel />
      </main>
    </div>
  )
}

import { AuthorPanel } from './authoring/AuthorPanel'
import { GrenadeToggle } from './components/GrenadeToggle'
import { InstructionPanel } from './components/InstructionPanel'
import { MapScene } from './components/MapScene'
import { SideToggle } from './components/SideToggle'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand">CS2 Smoke Viewer</span>
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

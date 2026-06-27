import { AuthorPanel } from './authoring/AuthorPanel'
import { InstructionPanel } from './components/InstructionPanel'
import { MapScene } from './components/MapScene'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">CS2 Smoke Viewer</span>
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

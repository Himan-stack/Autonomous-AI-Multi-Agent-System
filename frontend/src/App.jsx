import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Hero from './components/HeroDashboard'
import Workspace from './components/Workspace'
import ExecutionTimeline from './components/ExecutionTimeline'
import MetricsCards from './components/MetricsCards'
import LogsPanel from './components/LogsPanel'
import ResultPanel from './components/ResultPanel'
import SettingsModal from './components/SettingsModal'
import { useApp } from './context/AppContext'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { setPrompt, result, isRunning } = useApp()

  const showHero = !result && !isRunning

  return (
    <div className="grain relative min-h-screen text-zinc-100 flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 pb-16 space-y-8">
          {showHero && <Hero onPickPrompt={(p) => setPrompt(p)} />}

          <Workspace />
          <ExecutionTimeline />
          <MetricsCards />
          <LogsPanel />
          <ResultPanel />

          <footer className="max-w-5xl mx-auto w-full px-5 lg:px-8 pt-4">
            <div className="border-t hairline pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[11px] font-mono text-zinc-600">
              <div>
                nexus · v1 · <span className="text-zinc-500">react + vite frontend</span>
              </div>
              <div className="sm:ml-auto flex items-center gap-3">
                <span>gemini · groq</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>synchronous /agent contract</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
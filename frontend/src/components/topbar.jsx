import { Menu, Activity, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TopBar({ onOpenSidebar }) {
  const { isRunning, baseURL } = useApp()

  return (
    <header className="sticky top-0 z-20 border-b hairline glass">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
        <button
          data-testid="open-sidebar-btn"
          className="lg:hidden btn-ghost rounded-lg p-2"
          onClick={onOpenSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="text-zinc-500">workspace</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">autonomous-agent</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-500"
            data-testid="api-endpoint-indicator"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
            {baseURL.replace(/^https?:\/\//, '')}
          </div>

          <div
            className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border ${
              isRunning
                ? 'text-acid border-acid/30 bg-acid/[0.06]'
                : 'text-zinc-400 border-white/10'
            }`}
            data-testid="run-status-indicator"
          >
            {isRunning ? (
              <>
                <Activity className="w-3 h-3 animate-pulse" />
                agents running
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" />
                idle
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { classNames } from '../lib/utils'

const KIND_COLOR = {
  info: 'text-zinc-300',
  system: 'text-iris',
  stage: 'text-acid',
  ok: 'text-emerald-300',
  error: 'text-coral',
}

export default function LogsPanel() {
  const { logs, isRunning } = useApp()
  const [open, setOpen] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  if (logs.length === 0 && !isRunning) return null

  return (
    <section className="max-w-5xl mx-auto w-full px-5 lg:px-8" data-testid="logs-panel">
      <div className="rounded-xl border hairline bg-ink-900/60">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-left"
          data-testid="toggle-logs"
        >
          <Terminal className="w-3.5 h-3.5 text-acid" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
            execution logs
          </span>
          <span className="ml-auto text-[11px] font-mono text-zinc-500">
            {logs.length} entries
          </span>
          {open ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        {open && (
          <div
            ref={scrollRef}
            className="max-h-[220px] overflow-y-auto border-t hairline px-4 py-3 font-mono text-[12px] leading-relaxed"
          >
            {logs.map((l) => (
              <div key={l.id} className="flex gap-3">
                <span className="text-zinc-600 shrink-0">
                  {new Date(l.ts).toLocaleTimeString([], { hour12: false })}
                </span>
                <span className={classNames(KIND_COLOR[l.kind] || 'text-zinc-300')}>
                  {l.line}
                </span>
              </div>
            ))}
            {isRunning && (
              <div className="text-acid blink-cursor mt-1">waiting for orchestrator</div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

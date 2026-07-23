import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CornerDownLeft, Square, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Workspace() {
  const { prompt, setPrompt, submit, isRunning } = useApp()
  const taRef = useRef(null)

  useEffect(() => {
    if (!taRef.current) return
    taRef.current.style.height = 'auto'
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 240) + 'px'
  }, [prompt])

  const chars = prompt.length
  const ok = chars >= 10 && chars <= 5000

  const onKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (ok && !isRunning) submit()
    }
  }

  return (
    <section className="max-w-5xl mx-auto w-full px-5 lg:px-8">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass rounded-2xl p-3 sm:p-4 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)]"
        data-testid="workspace-panel"
      >
        <div className="flex items-center gap-2 px-2 pb-2">
          <span className="w-2 h-2 rounded-full bg-acid animate-pulseDot" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-400 font-mono">
            prompt · request
          </span>
          <span className="ml-auto text-[11px] font-mono text-zinc-500">
            <span className={ok ? 'text-acid' : 'text-zinc-500'}>{chars}</span>
            <span className="text-zinc-600"> / 5000</span>
          </span>
        </div>

        <textarea
          ref={taRef}
          data-testid="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKey}
          placeholder="Describe the document you want the agents to build. Be specific about audience, format, tone, and depth. Cmd/Ctrl + Enter to run."
          rows={3}
          maxLength={5000}
          className="w-full resize-none bg-transparent outline-none px-2 py-2 text-[15px] leading-relaxed placeholder:text-zinc-600"
        />

        <div className="mt-2 flex items-center justify-between gap-2 border-t hairline pt-3 px-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <kbd className="px-1.5 py-0.5 rounded border hairline bg-white/5">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border hairline bg-white/5">↵</kbd>
            <span className="hidden sm:inline">to dispatch</span>
          </div>

          <button
            data-testid="submit-btn"
            disabled={!ok || isRunning}
            onClick={submit}
            className="btn-acid rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold font-display flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                Run agents
                <CornerDownLeft className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </section>
  )
}

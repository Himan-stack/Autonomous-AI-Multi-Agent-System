import { motion } from 'framer-motion'
import { Check, Circle, Loader2, X, Brain, ListChecks, PenTool, Wand2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { STAGES, classNames } from '../lib/utils'

const ICONS = {
  analyzer: Brain,
  planner: ListChecks,
  executor: PenTool,
  reflection: Wand2,
}

function StageCard({ stage, status, index }) {
  const Icon = ICONS[stage.key]
  const active = status === 'running'
  const done = status === 'done' || status === 'running-done'
  const error = status === 'error'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={classNames(
        'relative rounded-xl border p-4 overflow-hidden transition-colors',
        active && 'border-acid/40 bg-acid/[0.04] shadow-glow',
        done && 'border-acid/25 bg-white/[0.02]',
        error && 'border-coral/40 bg-coral/[0.05]',
        !active && !done && !error && 'hairline bg-white/[0.015]'
      )}
      data-testid={`stage-card-${stage.key}`}
    >
      {active && <div className="scanline" />}
      <div className="relative flex items-start gap-3">
        <div
          className={classNames(
            'w-9 h-9 rounded-lg grid place-items-center shrink-0 border',
            active && 'border-acid/40 bg-acid/10 text-acid',
            done && 'border-acid/30 bg-acid/10 text-acid',
            error && 'border-coral/40 bg-coral/10 text-coral',
            !active && !done && !error && 'hairline text-zinc-500'
          )}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              agent 0{index + 1}
            </span>
            <div className="ml-auto">
              {active && <Loader2 className="w-3.5 h-3.5 animate-spin text-acid" />}
              {done && <Check className="w-3.5 h-3.5 text-acid" />}
              {error && <X className="w-3.5 h-3.5 text-coral" />}
              {!active && !done && !error && (
                <Circle className="w-3 h-3 text-zinc-600" />
              )}
            </div>
          </div>
          <div className="mt-1 font-display font-semibold tracking-tight">
            {stage.label}
          </div>
          <div className="mt-0.5 text-[12.5px] text-zinc-400 leading-snug">
            {stage.tagline}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExecutionTimeline() {
  const { stageStatus, isRunning } = useApp()
  const anyActive = Object.values(stageStatus).some((s) => s !== 'idle')

  if (!anyActive && !isRunning) return null

  return (
    <section className="max-w-5xl mx-auto w-full px-5 lg:px-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-acid" />
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
          live pipeline
        </div>
        <div className="ml-auto text-[11px] font-mono text-zinc-500">
          analyzer → planner → executor → reflection
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((s, i) => (
          <StageCard key={s.key} stage={s} status={stageStatus[s.key]} index={i} />
        ))}
      </div>
    </section>
  )
}

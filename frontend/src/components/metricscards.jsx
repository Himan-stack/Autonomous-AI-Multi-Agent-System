import { motion } from 'framer-motion'
import { Clock, FileType2, ListChecks, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Metric({ icon: Icon, label, value, sub, accent = 'acid' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl border hairline bg-white/[0.02] p-4 overflow-hidden"
    >
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-40 ${
          accent === 'acid' ? 'bg-acid/40' : accent === 'iris' ? 'bg-iris/40' : 'bg-sky-400/30'
        }`}
      />
      <div className="relative flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg grid place-items-center border hairline bg-white/[0.02] text-zinc-300">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
            {label}
          </div>
          <div className="mt-1 font-display font-semibold text-lg tracking-tight truncate">
            {value}
          </div>
          {sub && <div className="text-[11px] text-zinc-500 mt-0.5">{sub}</div>}
        </div>
      </div>
    </motion.div>
  )
}

export default function MetricsCards() {
  const { result, elapsed, isRunning } = useApp()
  if (!result && !isRunning) return null

  return (
    <section className="max-w-5xl mx-auto w-full px-5 lg:px-8" data-testid="metrics-cards">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric
          icon={Clock}
          label="execution"
          value={result?.execution_time || `${elapsed.toFixed(1)} sec`}
          sub={isRunning ? 'in progress' : 'end-to-end'}
        />
        <Metric
          icon={FileType2}
          label="document type"
          value={result?.document_type || '—'}
          sub="detected by analyzer"
          accent="iris"
        />
        <Metric
          icon={ListChecks}
          label="plan steps"
          value={result?.execution_plan?.length ?? '—'}
          sub="executed sequentially"
          accent="sky"
        />
        <Metric
          icon={ShieldCheck}
          label="status"
          value={result?.status || (isRunning ? 'Running' : '—')}
          sub={result?.status === 'Success' ? 'passed reflection' : 'awaiting completion'}
        />
      </div>
    </section>
  )
}

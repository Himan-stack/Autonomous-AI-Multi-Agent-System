import { motion } from 'framer-motion'
import { CheckCircle2, ListOrdered, Lightbulb } from 'lucide-react'
import { useApp } from '../context/AppContext'
import FileDownloads from './FileDownloads'

export default function ResultPanel() {
  const { result } = useApp()
  if (!result) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto w-full px-5 lg:px-8"
      data-testid="result-panel"
    >
      <div className="glass rounded-2xl p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-acid" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
            reflection · ready
          </span>
          <span className="ml-auto text-[11px] font-mono text-zinc-500">
            {result.execution_time}
          </span>
        </div>

        <h3 className="font-display font-semibold text-xl tracking-tight">
          {result.document_type}
        </h3>
        <p className="mt-1 text-[13.5px] text-zinc-400 leading-relaxed line-clamp-2">
          {result.request}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border hairline bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-iris" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                assumptions
              </span>
              <span className="ml-auto text-[10px] font-mono text-zinc-500">
                {result.assumptions?.length || 0}
              </span>
            </div>
            <ul className="space-y-2 text-[13px] text-zinc-300 leading-relaxed">
              {(result.assumptions || []).map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-iris shrink-0 font-mono text-[11px] mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{a}</span>
                </li>
              ))}
              {(!result.assumptions || result.assumptions.length === 0) && (
                <li className="text-zinc-500 text-[12.5px]">No assumptions returned.</li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border hairline bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered className="w-3.5 h-3.5 text-acid" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                execution plan
              </span>
              <span className="ml-auto text-[10px] font-mono text-zinc-500">
                {result.execution_plan?.length || 0} steps
              </span>
            </div>
            <ol className="space-y-2 text-[13px] text-zinc-300 leading-relaxed">
              {(result.execution_plan || []).map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-acid font-mono text-[11px] mt-0.5 shrink-0">
                    ▸ {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 border-t hairline pt-5">
          <FileDownloads files={result.generated_files} />
        </div>

        {result.message && (
          <div className="mt-4 text-[12.5px] text-zinc-400 border-l-2 border-acid/50 pl-3">
            {result.message}
          </div>
        )}
      </div>
    </motion.section>
  )
}

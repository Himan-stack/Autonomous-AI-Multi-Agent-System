import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const chips = [
  'Investor pitch deck outline for a climate-tech startup',
  'Executive brief on RAG vs fine-tuning for enterprise search',
  'Detailed PRD for a real-time collaborative whiteboard',
  'Legal-style NDA draft between two SaaS companies',
]

export default function Hero({ onPickPrompt }) {
  return (
    <section className="relative overflow-hidden ambient-glow">
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="relative max-w-5xl mx-auto px-5 lg:px-8 pt-12 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 border hairline rounded-full px-3 py-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulseDot" />
          multi-agent · analyzer → planner → executor → reflection
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 font-display font-semibold tracking-[-0.03em] leading-[0.95] text-[42px] sm:text-[56px] lg:text-[68px]"
        >
          Draft anything —{' '}
          <span className="font-serif italic text-shine">autonomously.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-2xl text-zinc-400 text-[15px] leading-relaxed"
        >
          Describe what you want. Four specialised agents will reason, plan, write, and
          refine the deliverable — then hand you polished{' '}
          <span className="text-zinc-200">DOCX, PDF, TXT, and Markdown</span>.
        </motion.p>

        <div className="mt-7 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <motion.button
              key={c}
              data-testid={`prompt-chip-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => onPickPrompt(c)}
              className="btn-ghost rounded-full px-3.5 py-1.5 text-[12.5px] flex items-center gap-1.5"
            >
              {c}
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

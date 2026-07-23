import { AnimatePresence, motion } from 'framer-motion'
import { X, Server, KeyRound, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SettingsModal({ open, onClose }) {
  const { baseURL } = useApp()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="settings-modal"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-lg glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border hairline grid place-items-center">
                <Server className="w-3.5 h-3.5 text-acid" />
              </div>
              <div>
                <div className="font-display font-semibold tracking-tight">
                  Connection & Keys
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  read-only from the frontend
                </div>
              </div>
              <button
                onClick={onClose}
                data-testid="close-settings-btn"
                className="ml-auto btn-ghost rounded-lg p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Field
                label="FastAPI base URL"
                value={baseURL}
                sub="Set VITE_API_BASE_URL in .env, then restart `yarn dev`."
              />

              <div className="rounded-xl border hairline p-4">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-iris" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                    API keys
                  </span>
                </div>
                <p className="text-[12.5px] text-zinc-400 leading-relaxed">
                  <code className="text-acid">GEMINI_API_KEY</code> and{' '}
                  <code className="text-iris">GROQ_API_KEY</code> live in your{' '}
                  <span className="text-zinc-200">backend/.env</span>. They are never
                  read or transmitted by this UI — the FastAPI server calls the
                  providers directly.
                </p>
              </div>

              <div className="rounded-xl border border-acid/20 bg-acid/[0.04] p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-acid mt-0.5" />
                  <p className="text-[12.5px] text-zinc-300 leading-relaxed">
                    Backend endpoint expected:{' '}
                    <span className="font-mono text-acid">POST /agent</span> · body{' '}
                    <span className="font-mono">{'{ request: string }'}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, value, sub }) {
  return (
    <div className="rounded-xl border hairline p-4">
      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1.5 font-mono text-[13px] text-zinc-200 break-all">
        {value}
      </div>
      {sub && <div className="mt-2 text-[11.5px] text-zinc-500">{sub}</div>}
    </div>
  )
}

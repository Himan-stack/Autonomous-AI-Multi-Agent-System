import { FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function DocumentStream() {
  const { documentText, isRunning, result } = useApp()

  if (!documentText) return null
  // Once the final result panel is showing, this live-draft view is
  // redundant — hide it instead of duplicating the same content twice.
  if (result) return null

  return (
    <section className="max-w-5xl mx-auto w-full px-5 lg:px-8" data-testid="document-stream">
      <div className="rounded-xl border hairline bg-ink-900/60">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <FileText className="w-3.5 h-3.5 text-acid" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
            document · streaming
          </span>
        </div>
        <div className="border-t hairline px-4 py-3 text-[13.5px] leading-relaxed text-zinc-300 whitespace-pre-wrap max-h-[320px] overflow-y-auto">
          {documentText}
          {isRunning && <span className="text-acid blink-cursor">▍</span>}
        </div>
      </div>
    </section>
  )
}

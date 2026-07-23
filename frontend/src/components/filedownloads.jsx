import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, FileDown, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'
import { fileBadge, shortenPath } from '../lib/utils'

export default function FileDownloads({ files }) {
  const [copied, setCopied] = useState(null)
  const [selected, setSelected] = useState(() => new Set(Object.keys(files || {})))

  if (!files) return null

  const toggle = (ext) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(ext)) next.delete(ext)
      else next.add(ext)
      return next
    })
  }

  const copy = async (ext, val) => {
    try {
      await navigator.clipboard.writeText(val)
      setCopied(ext)
      toast.success(`${ext.toUpperCase()} path copied`)
      setTimeout(() => setCopied(null), 1400)
    } catch {
      toast.error('Clipboard blocked by browser')
    }
  }

  const copyAllSelected = async () => {
    const lines = Object.entries(files)
      .filter(([ext]) => selected.has(ext))
      .map(([ext, p]) => `${ext.toUpperCase()}: ${p}`)
      .join('\n')
    if (!lines) return toast.error('Nothing selected')
    try {
      await navigator.clipboard.writeText(lines)
      toast.success('All selected paths copied')
    } catch {
      toast.error('Clipboard blocked by browser')
    }
  }

  return (
    <div data-testid="file-downloads">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-3.5 h-3.5 text-acid" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
            generated deliverables
          </span>
        </div>
        <button
          onClick={copyAllSelected}
          className="btn-ghost rounded-md px-2.5 py-1 text-[11px] font-mono flex items-center gap-1.5"
          data-testid="copy-selected-btn"
        >
          <Copy className="w-3 h-3" /> copy selected
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {Object.entries(files).map(([ext, path], i) => {
          const badge = fileBadge(ext)
          const isSelected = selected.has(ext)
          return (
            <motion.div
              key={ext}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-xl border p-3 bg-white/[0.02] transition ${
                isSelected ? 'border-acid/30' : 'hairline'
              }`}
              data-testid={`file-card-${ext}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(ext)}
                  className="mt-1 accent-[#c6ff3d]"
                  data-testid={`file-select-${ext}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ring-1 ${badge.color} ${badge.ring}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 truncate">
                      {shortenPath(path)}
                    </span>
                  </div>
                  <div className="mt-2 text-[11.5px] text-zinc-500 leading-snug">
                    Local server path. Copy or open on the machine running the FastAPI
                    backend.
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      copy(ext, path)
                    }}
                    className="btn-ghost rounded-md p-1.5"
                    title="Copy path"
                    data-testid={`copy-path-${ext}`}
                  >
                    {copied === ext ? (
                      <Check className="w-3.5 h-3.5 text-acid" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`http://localhost:8000/download/${path}`}
                    download 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost rounded-md p-1.5"
                    >
                    <FileDown className="w-3.5 h-3.5" />
                  </a>
                </div>
              </label>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

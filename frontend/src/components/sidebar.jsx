import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Trash2, Settings, Github, X, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { classNames } from '../lib/utils'

export default function Sidebar({ open, onClose, onOpenSettings }) {
  const { chats, activeId, newChat, loadChat, deleteChat, clearAllChats } = useApp()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-testid="sidebar-backdrop"
          />
        )}
      </AnimatePresence>

      <motion.aside
        data-testid="sidebar"
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={classNames(
          'fixed lg:sticky top-0 left-0 h-screen w-[280px] z-40 shrink-0',
          'flex flex-col border-r hairline glass',
          'lg:translate-x-0 lg:!transform-none'
        )}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-ink-800 border hairline grid place-items-center">
              <Sparkles className="w-4 h-4 text-acid" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-acid animate-pulseDot" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold tracking-tight">Nexus</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-mono">
                autonomous · agent
              </div>
            </div>
          </div>
          <button
            data-testid="sidebar-close-btn"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New chat */}
        <div className="px-4">
          <button
            data-testid="new-chat-btn"
            onClick={newChat}
            className="w-full btn-acid rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 font-display"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Session
          </button>
        </div>

        {/* History */}
        <div className="mt-5 px-4 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-mono">
            History · {chats.length}
          </div>
          {chats.length > 0 && (
            <button
              data-testid="clear-chats-btn"
              onClick={clearAllChats}
              className="text-[10px] text-zinc-500 hover:text-coral transition"
            >
              clear all
            </button>
          )}
        </div>

        <div className="mt-2 flex-1 overflow-y-auto px-2 pb-2">
          {chats.length === 0 && (
            <div className="px-3 py-6 text-xs text-zinc-500 leading-relaxed">
              No sessions yet. Kick off a run and it will land here — stored locally on your device.
            </div>
          )}
          <ul className="space-y-1">
            {chats.map((c) => (
              <li key={c.id}>
                <div
                  className={classNames(
                    'group relative flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer',
                    'hover:bg-white/5 transition',
                    activeId === c.id && 'bg-white/[0.06] ring-1 ring-acid/25'
                  )}
                  onClick={() => loadChat(c.id)}
                  data-testid={`chat-item-${c.id}`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] text-zinc-200 truncate">{c.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate">
                      {c.result?.document_type || 'draft'} ·{' '}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    data-testid={`delete-chat-${c.id}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(c.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-coral transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t hairline p-3 flex items-center gap-2">
          <button
            data-testid="open-settings-btn"
            onClick={onOpenSettings}
            className="flex-1 btn-ghost rounded-lg px-3 py-2 text-xs flex items-center gap-2"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost rounded-lg px-2.5 py-2"
            data-testid="github-link"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.aside>
    </>
  )
}

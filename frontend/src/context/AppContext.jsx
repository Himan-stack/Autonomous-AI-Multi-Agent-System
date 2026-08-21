import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { runAgentStream, getBaseURL } from '../services/api'
import { STAGES } from '../lib/utils'
import { toast } from 'sonner'

const AppContext = createContext(null)
const STORAGE_KEY = 'nexus:chats:v1'

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function loadChats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveChats(chats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  } catch {
    /* ignore */
  }
}

export function AppProvider({ children }) {
  const [chats, setChats] = useState(() => loadChats())
  const [activeId, setActiveId] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [stageStatus, setStageStatus] = useState(
    () => Object.fromEntries(STAGES.map((s) => [s.key, 'idle']))
  )
  const [logs, setLogs] = useState([])
  const [documentText, setDocumentText] = useState('')
  const [result, setResult] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => saveChats(chats), [chats])

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId) || null,
    [chats, activeId]
  )

  const pushLog = useCallback((line, kind = 'info') => {
    setLogs((l) => [
      ...l,
      {
        id: uid(),
        ts: new Date().toISOString(),
        line,
        kind,
      },
    ])
  }, [])

  const resetRunState = useCallback(() => {
    setStageStatus(Object.fromEntries(STAGES.map((s) => [s.key, 'idle'])))
    setLogs([])
    setDocumentText('')
    setResult(null)
    setElapsed(0)
  }, [])

  const newChat = useCallback(() => {
    resetRunState()
    setActiveId(null)
    setPrompt('')
  }, [resetRunState])

  const loadChat = useCallback((id) => {
    const c = chats.find((x) => x.id === id)
    if (!c) return
    setActiveId(id)
    setPrompt(c.prompt || '')
    setResult(c.result || null)
    setLogs(c.logs || [])
    setStageStatus(
      c.result
        ? Object.fromEntries(STAGES.map((s) => [s.key, 'done']))
        : Object.fromEntries(STAGES.map((s) => [s.key, 'idle']))
    )
    setElapsed(c.elapsed || 0)
  }, [chats])

  const deleteChat = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) {
      setActiveId(null)
      resetRunState()
      setPrompt('')
    }
    toast.success('Chat removed')
  }, [activeId, resetRunState])

  const clearAllChats = useCallback(() => {
    setChats([])
    setActiveId(null)
    resetRunState()
    setPrompt('')
    toast.success('All chats cleared')
  }, [resetRunState])

  const submit = useCallback(async () => {
    const trimmed = prompt.trim()
    if (trimmed.length < 10) {
      toast.error('Prompt must be at least 10 characters')
      return
    }
    resetRunState()
    setIsRunning(true)
    const startedAt = performance.now()
    timerRef.current = setInterval(() => {
      setElapsed((performance.now() - startedAt) / 1000)
    }, 100)

    pushLog(`⚡ Dispatching request to ${getBaseURL()}/agent/stream`, 'system')
    pushLog(`payload → { request: "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}" }`, 'system')

    try {
      let finalData = null
      let streamError = null

      // Real backend progress only: each stageStatus update below is
      // driven directly by an actual SSE event from the running
      // Analyzer/Planner/Executor/Reflection pipeline — no timers,
      // no simulated delays.
      await runAgentStream(trimmed, {
        onStatus: ({ stage, status, message }) => {
          if (status === 'running') {
            setStageStatus((prev) => ({ ...prev, [stage]: 'running' }))
            pushLog(`◇ ${stage} started — ${message}`, 'stage')
          } else if (status === 'completed') {
            setStageStatus((prev) => ({ ...prev, [stage]: 'done' }))
            pushLog(`✓ ${stage} complete — ${message}`, 'ok')
          }
        },
        onContent: ({ text }) => {
          // Progressive real document text, chunk by chunk, as it
          // arrives over SSE — not simulated, not delayed client-side.
          setDocumentText((prev) => (prev ? `${prev} ${text}` : text))
        },
        onComplete: (result) => {
          finalData = result
        },
        onError: (message) => {
          streamError = message
        },
      })

      if (streamError) throw new Error(streamError)
      if (!finalData) throw new Error('Stream ended without a result')

      const data = finalData
      setResult(data)
      pushLog(`✓ All 4 agents finished · ${data.execution_time}`, 'ok')
      pushLog(`▸ Document type: ${data.document_type}`, 'info')
      if (Array.isArray(data.assumptions))
        pushLog(`▸ ${data.assumptions.length} assumptions inferred`, 'info')
      if (Array.isArray(data.execution_plan))
        pushLog(`▸ ${data.execution_plan.length} plan steps executed`, 'info')

      const id = activeId || uid()
      const title = trimmed.length > 60 ? trimmed.slice(0, 60) + '…' : trimmed
      const chatRecord = {
        id,
        title,
        prompt: trimmed,
        result: data,
        logs: [],
        elapsed: (performance.now() - startedAt) / 1000,
        createdAt: Date.now(),
      }
      setChats((prev) => {
        const exists = prev.some((c) => c.id === id)
        if (exists) return prev.map((c) => (c.id === id ? { ...c, ...chatRecord } : c))
        return [chatRecord, ...prev]
      })
      setActiveId(id)
      toast.success('Agent workflow complete')
    } catch (err) {
      // Mark any stage that never reported completion as errored,
      // while preserving the real 'done' status of stages that
      // genuinely finished before the failure.
      setStageStatus((prev) =>
        Object.fromEntries(
          STAGES.map((s) => [s.key, prev[s.key] === 'done' ? 'done' : 'error'])
        )
      )
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Unknown error while contacting /agent/stream'
      pushLog(`✗ ${msg}`, 'error')
      toast.error(msg)
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsRunning(false)
    }
  }, [prompt, activeId, pushLog, resetRunState])

  const value = {
    chats,
    activeChat,
    activeId,
    prompt,
    setPrompt,
    isRunning,
    stageStatus,
    logs,
    documentText,
    result,
    elapsed,
    submit,
    newChat,
    loadChat,
    deleteChat,
    clearAllChats,
    baseURL: getBaseURL(),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

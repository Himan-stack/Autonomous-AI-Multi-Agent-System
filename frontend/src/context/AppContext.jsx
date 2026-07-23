import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { runAgent, getBaseURL } from '../services/api'
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
  const [result, setResult] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)
  const stageTimerRef = useRef(null)

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

  // Fake staged progress while backend runs (backend is synchronous)
  const startStagedProgress = useCallback(() => {
    const seq = STAGES.map((s) => s.key)
    let i = 0
    setStageStatus((prev) => ({ ...prev, [seq[0]]: 'running' }))
    pushLog(`◇ ${STAGES[0].label} started — ${STAGES[0].hint}`, 'stage')

    stageTimerRef.current = setInterval(() => {
      i += 1
      if (i >= seq.length) return
      setStageStatus((prev) => ({
        ...prev,
        [seq[i - 1]]: 'running-done',
        [seq[i]]: 'running',
      }))
      pushLog(`✓ ${STAGES[i - 1].label} complete`, 'ok')
      pushLog(`◇ ${STAGES[i].label} started — ${STAGES[i].hint}`, 'stage')
    }, 2600)
  }, [pushLog])

  const stopStagedProgress = useCallback((success) => {
    if (stageTimerRef.current) {
      clearInterval(stageTimerRef.current)
      stageTimerRef.current = null
    }
    setStageStatus(
      Object.fromEntries(
        STAGES.map((s) => [s.key, success ? 'done' : 'error'])
      )
    )
  }, [])

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

    pushLog(`⚡ Dispatching request to ${getBaseURL()}/agent`, 'system')
    pushLog(`payload → { request: "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}" }`, 'system')
    startStagedProgress()

    try {
      const data = await runAgent(trimmed)
      stopStagedProgress(true)
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
      stopStagedProgress(false)
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Unknown error while contacting /agent'
      pushLog(`✗ ${msg}`, 'error')
      toast.error(msg)
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsRunning(false)
    }
  }, [prompt, activeId, pushLog, resetRunState, startStagedProgress, stopStagedProgress])

  const value = {
    chats,
    activeChat,
    activeId,
    prompt,
    setPrompt,
    isRunning,
    stageStatus,
    logs,
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

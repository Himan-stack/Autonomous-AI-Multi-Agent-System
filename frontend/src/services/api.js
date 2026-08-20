import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  timeout: 180000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Runs the autonomous agent workflow.
 * Backend contract (POST /agent):
 *   body:   { request: string }  (min 10, max 5000 chars)
 *   return: { request, document_type, assumptions[], execution_plan[],
 *             status, execution_time, generated_files: {docx,pdf,txt,md},
 *             message? }
 */
export async function runAgent(prompt) {
  const { data } = await api.post('/agent', { request: prompt })
  return data
}

export async function healthCheck() {
  const { data } = await api.get('/')
  return data
}

/**
 * Streaming counterpart of runAgent().
 * Backend contract (POST /agent/stream, Server-Sent Events):
 *   body: { request: string }  (min 10, max 5000 chars)
 *   events:
 *     event: status   data: { stage, status: 'running'|'completed', message }
 *     event: complete data: <same shape as the existing /agent response>
 *     event: error    data: { message }
 *
 * Uses fetch() + a manual ReadableStream/SSE parser (not EventSource,
 * since EventSource cannot send a POST body). Real backend events only —
 * no client-side timers or simulated progress.
 *
 * @param {string} prompt
 * @param {{ onStatus?: (evt: {stage:string,status:string,message:string}) => void,
 *           onComplete?: (result: object) => void,
 *           onError?: (message: string) => void,
 *           signal?: AbortSignal }} handlers
 */
export async function runAgentStream(prompt, handlers = {}) {
  const { onStatus, onComplete, onError, signal } = handlers

  const res = await fetch(`${baseURL}/agent/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request: prompt }),
    signal,
  })

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '')
    let message = `Streaming request failed (${res.status})`
    try {
      const parsed = JSON.parse(text)
      message = parsed?.detail || parsed?.message || message
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(message)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const dispatch = (rawEvent) => {
    // rawEvent is one "event: X\ndata: Y" block (data may itself contain
    // embedded newlines-free JSON, matching the backend's _sse() format).
    let eventType = 'message'
    let dataLine = ''

    for (const line of rawEvent.split('\n')) {
      if (line.startsWith('event:')) {
        eventType = line.slice('event:'.length).trim()
      } else if (line.startsWith('data:')) {
        dataLine += line.slice('data:'.length).trim()
      }
    }

    if (!dataLine) return

    let data
    try {
      data = JSON.parse(dataLine)
    } catch {
      return
    }

    if (eventType === 'status') {
      onStatus?.(data)
    } else if (eventType === 'complete') {
      onComplete?.(data)
    } else if (eventType === 'error') {
      onError?.(data.message || 'Unknown streaming error')
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // SSE frames are separated by a blank line ("\n\n")
    let sepIndex
    while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, sepIndex)
      buffer = buffer.slice(sepIndex + 2)
      if (rawEvent.trim()) dispatch(rawEvent)
    }
  }

  // Flush any trailing frame without a final blank-line separator
  if (buffer.trim()) dispatch(buffer)
}

export function getBaseURL() {
  return baseURL
}
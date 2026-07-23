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

export function getBaseURL() {
  return baseURL
}

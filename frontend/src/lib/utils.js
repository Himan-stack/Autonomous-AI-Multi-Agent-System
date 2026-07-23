export const STAGES = [
  {
    key: 'analyzer',
    label: 'Analyzer',
    tagline: 'understands intent & constraints',
    hint: 'Detects document type · extracts assumptions',
  },
  {
    key: 'planner',
    label: 'Planner',
    tagline: 'crafts a step-by-step blueprint',
    hint: 'Turns intent into an ordered execution plan',
  },
  {
    key: 'executor',
    label: 'Executor',
    tagline: 'writes the deliverable',
    hint: 'Generates the full document body',
  },
  {
    key: 'reflection',
    label: 'Reflection',
    tagline: 'reviews & polishes the output',
    hint: 'Self-critique · quality improvements',
  },
]

export function classNames(...c) {
  return c.filter(Boolean).join(' ')
}

export function shortenPath(p, max = 42) {
  if (!p) return ''
  if (p.length <= max) return p
  const head = p.slice(0, 12)
  const tail = p.slice(-(max - 15))
  return `${head}…${tail}`
}

export function fileBadge(ext) {
  const map = {
    docx: { label: 'DOCX', color: 'text-sky-300', ring: 'ring-sky-400/30' },
    pdf: { label: 'PDF', color: 'text-rose-300', ring: 'ring-rose-400/30' },
    txt: { label: 'TXT', color: 'text-zinc-200', ring: 'ring-zinc-400/30' },
    md: { label: 'MD', color: 'text-acid', ring: 'ring-acid/40' },
  }
  return map[ext] || map.txt
}
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROOT, safePath } from './ai-memory.mjs'

export function assessProgress(state) {
  const maxCycles = state.maxCycles ?? 6
  if (!Number.isInteger(maxCycles) || maxCycles < 1 || maxCycles > 50 || !Array.isArray(state.cycles)) throw new Error('Invalid loop budget or state')
  if (state.completed) return { next: 'complete', authority: 'advice_only' }
  if (state.pendingExternalAction) return { next: 'owner_gate', action: state.pendingExternalAction, authority: 'advice_only' }
  if (state.cycles.length >= maxCycles) return { next: 'stop_budget', authority: 'advice_only' }
  const signatures = state.cycles.slice(-3).map(c => JSON.stringify([...new Set(c.evidence || [])].sort()))
  if (signatures.length === 3 && new Set(signatures).size === 1) return { next: 'stop_no_progress', authority: 'advice_only' }
  return { next: 'continue_authorized_work', authority: 'advice_only', remaining: maxCycles - state.cycles.length }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(assessProgress(JSON.parse(readFileSync(safePath(ROOT, process.argv[2]), 'utf8'))), null, 2)) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}

import { ref } from 'vue'

const DEFAULT_KEEP_EVENTS = ['round-start', 'turn-start', 'game-over']

// Build a Summary/Detail filter for the game log. Returns reactive viewMode,
// a setter, and a filterEntries function suitable for useGameLogProvider.
//
// Options:
//   storageKey         — localStorage key for persistence (null disables)
//   defaultMode        — 'summary' (default) or 'detail'
//   keepEvents         — entry.event values always shown in summary mode
//   keepPhases         — phase-start templates shown as section headers in
//                        summary mode (children still filtered)
//   passthroughPhases  — phase-start templates whose entire section renders
//                        verbatim in summary mode until the next phase-start
export function useSummaryLog(options = {}) {
  const {
    storageKey = null,
    defaultMode = 'summary',
    keepEvents = DEFAULT_KEEP_EVENTS,
    keepPhases = [],
    passthroughPhases = [],
  } = options

  const initialMode = storageKey
    ? (window.localStorage.getItem(storageKey) || defaultMode)
    : defaultMode

  const viewMode = ref(initialMode)
  const keepEventSet = new Set(keepEvents)
  const keepPhaseSet = new Set(keepPhases)
  const passthroughPhaseSet = new Set(passthroughPhases)

  function setMode(mode) {
    viewMode.value = mode
    if (storageKey) {
      window.localStorage.setItem(storageKey, mode)
    }
  }

  function filterEntries(entries) {
    if (viewMode.value !== 'summary') {
      return entries
    }

    let inPassthrough = false
    const out = []
    for (const entry of entries) {
      if (entry.type !== 'log') {
        out.push(entry)
        continue
      }
      if (entry.event === 'phase-start') {
        inPassthrough = passthroughPhaseSet.has(entry.template)
        if (inPassthrough || keepPhaseSet.has(entry.template)) {
          out.push(entry)
        }
        continue
      }
      if (inPassthrough) {
        out.push(entry)
        continue
      }
      if (entry.event && keepEventSet.has(entry.event)) {
        out.push(entry)
        continue
      }
      if (entry.summary) {
        out.push(entry)
      }
    }
    return out
  }

  return { viewMode, setMode, filterEntries }
}

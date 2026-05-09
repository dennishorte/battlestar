/**
 * Singleton job tracker for the Scryfall update flow.
 *
 * The update is too slow to run inside a request, so the controller kicks
 * off a background async runner and the frontend polls for progress. State
 * lives in process memory — if the API restarts mid-run, the job is lost
 * and the user must retry.
 */

const state = {
  running: false,
  startedAt: null,
  finishedAt: null,
  phase: null,
  log: [],
  error: null,
  result: null,
}

function reset() {
  state.running = true
  state.startedAt = new Date().toISOString()
  state.finishedAt = null
  state.phase = 'starting'
  state.log = []
  state.error = null
  state.result = null
}

function makeProgress() {
  return {
    log(msg) {
      const line = `[${new Date().toISOString()}] ${msg}`
      console.log('scryfall-update:', msg)
      state.log.push(line)
    },
    setPhase(phase) {
      state.phase = phase
    },
  }
}

/**
 * Start the job. Returns false if a job is already running.
 * @param {(progress) => Promise<any>} runner
 */
export function start(runner) {
  if (state.running) {
    return false
  }
  reset()
  const progress = makeProgress()

  // Fire and forget. We deliberately don't await so the controller can return
  // immediately. Errors are captured into state.error.
  ;(async () => {
    try {
      const result = await runner(progress)
      state.result = result
      progress.log('Job complete')
    }
    catch (err) {
      console.error('scryfall-update failed:', err)
      state.error = err.message || String(err)
      progress.log(`ERROR: ${state.error}`)
    }
    finally {
      state.running = false
      state.finishedAt = new Date().toISOString()
      state.phase = state.error ? 'error' : 'done'
    }
  })()

  return true
}

export function getStatus() {
  return {
    running: state.running,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    phase: state.phase,
    log: state.log,
    error: state.error,
    result: state.result,
  }
}

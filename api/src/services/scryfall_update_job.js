/**
 * Singleton tracker for the Scryfall update worker.
 *
 * The update is too heavy to run inside the API process: parsing a ~600MB
 * bulk file and inserting it into Mongo competes with request handling and
 * can OOM the server. We spawn `api/scripts/update_scryfall.js` as a child
 * process and tail its stdout/stderr into a log buffer that the admin UI
 * polls.
 *
 * State is in-process and is reset each run. A restart wipes the log; the
 * user retries.
 */

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORKER_PATH = path.resolve(__dirname, '../../scripts/update_scryfall.js')

const state = {
  running: false,
  startedAt: null,
  finishedAt: null,
  phase: null,
  log: [],
  error: null,
  result: null,
  child: null,
}

function reset() {
  state.running = true
  state.startedAt = new Date().toISOString()
  state.finishedAt = null
  state.phase = 'spawning'
  state.log = []
  state.error = null
  state.result = null
  state.child = null
}

function pushLine(line) {
  if (!line) {
    return
  }
  state.log.push(line)

  // Worker prefixes phases with [phase-name]. Pick that up so the UI can
  // show what's currently happening even when no new lines have arrived
  // recently.
  const phaseMatch = line.match(/^\[([a-z-]+)\]/)
  if (phaseMatch) {
    state.phase = phaseMatch[1]
  }

  // Result line written at the end of a successful run.
  const resultMatch = line.match(/RESULT sets=(\d+) cards=(\d+) version=(\S+)/)
  if (resultMatch) {
    state.result = {
      sets: Number(resultMatch[1]),
      cards: Number(resultMatch[2]),
      version: resultMatch[3],
    }
  }
}

function makeLineSplitter(prefix = '') {
  let leftover = ''
  return (chunk) => {
    leftover += chunk.toString('utf8')
    const lines = leftover.split('\n')
    leftover = lines.pop()
    for (const line of lines) {
      pushLine(prefix + line)
    }
  }
}

export function start({ workerPath = WORKER_PATH, spawnFn = spawn } = {}) {
  if (state.running) {
    return false
  }
  reset()

  let child
  try {
    child = spawnFn(process.execPath, ['--max-old-space-size=4096', workerPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    })
  }
  catch (err) {
    state.running = false
    state.finishedAt = new Date().toISOString()
    state.error = err.message
    state.phase = 'error'
    return false
  }

  state.child = child

  child.stdout.on('data', makeLineSplitter(''))
  child.stderr.on('data', makeLineSplitter('[stderr] '))

  child.on('error', (err) => {
    pushLine(`[error] spawn error: ${err.message}`)
    state.error = err.message
    state.running = false
    state.finishedAt = new Date().toISOString()
    state.phase = 'error'
    state.child = null
  })

  child.on('exit', (code, signal) => {
    state.running = false
    state.finishedAt = new Date().toISOString()
    state.child = null

    if (code === 0) {
      state.phase = 'done'
    }
    else {
      state.phase = 'error'
      state.error = signal
        ? `Worker killed by signal ${signal}`
        : `Worker exited with code ${code}`
    }
  })

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

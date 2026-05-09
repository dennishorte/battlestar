import db from '../../models/db.js'
import * as job from '../../services/scryfall_update_job.js'

/**
 * Kick off a background Scryfall update (sets + cards). Returns immediately.
 * Use the status endpoint to poll progress.
 */
export const update = async (req, res) => {
  const started = job.start(progress => db.magic.scryfall.runFullUpdate(progress))

  if (!started) {
    return res.status(409).json({
      status: 'error',
      message: 'Update already running',
      ...job.getStatus(),
    })
  }

  res.json({ status: 'started', ...job.getStatus() })
}

/**
 * Return current job status: running flag, phase, log, error, result.
 */
export const updateStatus = async (req, res) => {
  res.json({ status: 'success', ...job.getStatus() })
}

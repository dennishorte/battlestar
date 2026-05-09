import * as job from '../../services/scryfall_update_job.js'

/**
 * Kick off the Scryfall update worker. Returns immediately; poll updateStatus
 * for progress.
 */
export const update = async (req, res) => {
  const started = job.start()
  res.json({
    status: 'success',
    started,
    message: started ? 'Update started' : 'Update already running',
    ...job.getStatus(),
  })
}

export const updateStatus = async (req, res) => {
  res.json({ status: 'success', ...job.getStatus() })
}

const db = require('../../models/db.js')
const AsyncLock = require('async-lock')
const { util } = require('battlestar-common')

// Create a lock for scar operations to prevent race conditions
const lock = new AsyncLock()

/**
 * Apply a scar to cards
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.apply = async (req, res) => {
  await lock.acquire('scar', async () => {
    await db.magic.scar.apply(req.body.scarId, req.body.userId, req.body.cardIdDict)
    res.json({ status: 'success' })
  })
}

/**
 * Fetch all scars for a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetchAll = async (req, res) => {
  await lock.acquire('scar', async () => {
    const scars = await db.magic.scar.fetchByCubeId(req.body.cubeId)
    res.json({
      status: 'success',
      scars,
    })
  })
}

/**
 * Fetch available scars for a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetchAvailable = async (req, res) => {
  await lock.acquire('scar', async () => {
    const scars = await db.magic.scar.fetchAvailable(req.body.cubeId)
    util.array.shuffle(scars)

    const toReturn = scars.slice(0, req.body.count)

    if (req.body.lock) {
      await db.magic.scar.lock(toReturn, req.body.userId)
    }

    res.json({
      status: 'success',
      scars: toReturn,
    })
  })
}

/**
 * Release scars for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.releaseByUser = async (req, res) => {
  await lock.acquire('scar', async () => {
    db.magic.scar.releaseByUser(req.body.userId)
    res.json({
      status: 'success'
    })
  })
}

/**
 * Save a scar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.save = async (req, res) => {
  await lock.acquire('scar', async () => {
    const scar = await db.magic.scar.save(req.body.scar)

    res.json({
      status: 'success',
      scar,
    })
  })
} 
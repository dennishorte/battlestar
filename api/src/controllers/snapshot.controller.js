const db = require('../models/db')
const logger = require('../utils/logger')
const { BadRequestError, NotFoundError } = require('../utils/errors')

/**
 * Create a new snapshot from a game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createSnapshot = async (req, res, next) => {
  try {
    if (!req.body.gameId) {
      return next(new BadRequestError('Game ID is required'))
    }

    const game = await db.game.findById(req.body.gameId)
    if (!game) {
      return next(new NotFoundError(`Game with ID ${req.body.gameId} not found`))
    }

    await db.snapshot.create(game)
    res.json({
      status: 'success',
      message: 'Snapshot created'
    })
  } catch (err) {
    logger.error(`Error creating snapshot: ${err.message}`)
    next(err)
  }
}

/**
 * Fetch snapshots for a specific game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getSnapshots = async (req, res, next) => {
  try {
    if (!req.body.gameId) {
      return next(new BadRequestError('Game ID is required'))
    }

    const snapshots = await db.snapshot.findByGameId(req.body.gameId)
    const array = await snapshots.toArray()
    
    res.json({
      status: 'success',
      snapshots: array
    })
  } catch (err) {
    logger.error(`Error fetching snapshots: ${err.message}`)
    next(err)
  }
} 
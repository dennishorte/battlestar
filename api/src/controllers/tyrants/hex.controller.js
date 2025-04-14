const db = require('../../models/db')
const logger = require('../../utils/logger')
const { BadRequestError, NotFoundError } = require('../../utils/errors')

/**
 * Get all hexes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllHexes = async (req, res, next) => {
  try {
    const hexes = await db.tyrants.hex.fetchAll()
    
    res.json({
      status: 'success',
      hexes
    })
  } catch (err) {
    logger.error(`Error fetching all hexes: ${err.message}`)
    next(err)
  }
}

/**
 * Delete a hex
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteHex = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return next(new BadRequestError('Hex ID is required'))
    }
    
    await db.tyrants.hex.delete(req.body.id)
    
    res.json({
      status: 'success'
    })
  } catch (err) {
    logger.error(`Error deleting hex: ${err.message}`)
    next(err)
  }
}

/**
 * Save a hex
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.saveHex = async (req, res, next) => {
  try {
    if (!req.body.hex) {
      return next(new BadRequestError('Hex data is required'))
    }
    
    await db.tyrants.hex.save(req.body.hex)
    
    res.json({
      status: 'success'
    })
  } catch (err) {
    logger.error(`Error saving hex: ${err.message}`)
    next(err)
  }
} 
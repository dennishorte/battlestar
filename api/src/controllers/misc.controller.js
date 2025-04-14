const db = require('../models/db')
const logger = require('../utils/logger')

/**
 * Get the application version
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAppVersion = async (req, res, next) => {
  try {
    const version = await db.misc.appVersion()
    res.json({
      status: 'success',
      version
    })
  } catch (err) {
    logger.error(`Error fetching app version: ${err.message}`)
    next(err)
  }
} 
import db from '#/models/db.js'
import logger from '#/utils/logger.js'

/**
 * Get the application version
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAppVersion = async (req, res, next) => {
  try {
    const version = await db.misc.appVersion()
    res.json({
      status: 'success',
      version
    })
  }
  catch (err) {
    logger.error(`Error fetching app version: ${err.message}`)
    next(err)
  }
}

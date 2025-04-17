const db = require('../../models/db.js')

/**
 * Update all Scryfall data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAll = async (req, res) => {
  const result = await db.magic.scryfall.updateAll()
  res.json({
    status: 'success',
    message: 'Scryfall data updated',
    ...result,
  })
}

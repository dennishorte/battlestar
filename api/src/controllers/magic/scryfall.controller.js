const db = require('../../models/db.js')

/**
 * Update  Scryfall data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  const result = await db.magic.scryfall.update()
  res.json({
    status: 'success',
    message: 'Scryfall data updated',
    ...result,
  })
}

import db from '../../models/db.js'

/**
 * Update Scryfall data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const update = async (req, res) => {
  try {
    const result = await db.magic.scryfall.update()
    res.json({
      status: 'success',
      message: 'Scryfall data updated',
      ...result,
    })
  }
  catch (error) {
    console.error('Error updating Scryfall data:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

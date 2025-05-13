const db = require('#/models/db.js')

/**
 * Create a new deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.create = async (req, res) => {
  const deck = await db.magic.deck.create(req.user)

  res.json({
    status: 'success',
    deck,
  })
}

exports.delete = async (req, res) => {
  await db.magic.deck.delete(req.deck)

  res.json({
    status: 'success'
  })
}

/**
 * Duplicate a deck by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.duplicate = async (req, res) => {
  const deck = await db.magic.deck.duplicate(req.user, req.deck)
  res.json({
    status: 'success',
    deck,
  })
}

/**
 * Fetch a deck by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetch = async (req, res) => {
  res.json({
    status: 'success',
    deck: req.deck,
  })
}

/**
 * Save changes to a deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.save = async (req, res) => {
  await db.magic.deck.save(req.body.deck)
  res.json({
    status: 'success',
  })
}

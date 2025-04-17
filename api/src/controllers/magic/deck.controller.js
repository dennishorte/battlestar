const db = require('../../models/db.js')

/**
 * Create a new deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.create = async (req, res) => {
  const deckId = await db.magic.deck.create(req.body)
  const deck = await db.magic.deck.findById(deckId)

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

/**
 * Add a card to a deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addCard = async (req, res) => {
  // Validate required resources were loaded by middleware
  if (!req.deck || !req.card) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required resources: deck and card must be loaded'
    })
  }

  await db.magic.deck.addCard(req.deck, req.card)
  res.json({
    status: 'success',
  })
}

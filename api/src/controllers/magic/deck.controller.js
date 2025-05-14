import db from '#/models/db.js'

/**
 * Create a new deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const create = async (req, res) => {
  const deck = await db.magic.deck.create(req.user)

  res.json({
    status: 'success',
    deck,
  })
}

export const deleteDeck = async (req, res) => {
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
export const duplicate = async (req, res) => {
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
export const fetch = async (req, res) => {
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
export const save = async (req, res) => {
  await db.magic.deck.save(req.body.deck)
  res.json({
    status: 'success',
  })
}

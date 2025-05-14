import db from '../../models/db.js'

/**
 * Create a new deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const create = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.deckData) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required field: deckData'
      })
    }

    // Create the deck
    const deck = await db.magic.deck.create(req.body.deckData, req.user)

    res.json({
      status: 'success',
      deck
    })
  }
  catch (error) {
    console.error('Error creating deck:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Find all decks for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const findAll = async (req, res) => {
  try {
    const decks = await db.magic.deck.findAll(req.user)

    res.json({
      status: 'success',
      decks
    })
  }
  catch (error) {
    console.error('Error finding decks:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

/**
 * Update a deck
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const update = async (req, res) => {
  try {
    // Validate required inputs
    if (!req.body.deckId || !req.body.deckData) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: deckId and deckData'
      })
    }

    // Update the deck
    const deck = await db.magic.deck.update(req.body.deckId, req.body.deckData, req.user)

    res.json({
      status: 'success',
      deck
    })
  }
  catch (error) {
    console.error('Error updating deck:', error)
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
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

const db = require('../../models/db.js')
const { mag } = require('battlestar-common')

/**
 * Fetch all cards
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetchAll = async (req, res) => {
  const cardData = await db.magic.card.fetchAll(req.body.source)

  res.json({
    status: 'success',
    ...cardData
  })
}

/**
 * Helper function to extract card data from request
 * @param {Object} req - Express request object
 * @param {String} name - Name of the property to extract
 * @returns {Object|null} Card data
 */
function _extractCardData(req, name) {
  if (!req.body[name]) {
    return null
  }
  else {
    return req.body[name].data ? req.body[name].data : req.body[name]
  }
}

/**
 * Save a card
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.save = async (req, res) => {
  const card = _extractCardData(req, 'card')
  const original = _extractCardData(req, 'original')
  const { editor, comment } = req.body

  if (card.data) {
    throw new Error('Card had data ' + card.name)
  }

  if (original && original.data) {
    throw new Error('Original had data ' + original.name)
  }

  const replaceScryfallCard = original && !original.custom_id
  let cardCreated = false

  // You can't edit a Scryfall card. Create a copy of the Scryfall card and update that.
  let toUpdate
  if (replaceScryfallCard) {
    toUpdate = await db.magic.card.insertCustom(original)
  }

  // Overwrite the existing custom card, in-place.
  else if (original) {
    toUpdate = await db.magic.card.findById(original._id)
  }

  // Overwrite the existing custom card, in-place.
  else if (card._id) {
    toUpdate = await db.magic.card.findById(card._id)
  }

  // If this is a new card, we're not updating anything.
  else {
    cardCreated = true

    card.id = 'no_id_for_custom_cards'
    if (!card.name.trim()) {
      card.name = 'unnamed'
    }

    toUpdate = card
  }

  // Remove fields that should not be altered.
  delete card._id
  delete card.custom_id
  delete card.edits
  delete card.set
  delete card.collector_number
  delete card.legal

  // Update the card model.
  const toInsert = {
    ...toUpdate,
    ...card
  }

  // Update the edit history.
  toInsert.edits = toInsert.edits || []
  toInsert.edits.push({
    editor,
    comment: comment || 'no comment',
    timestamp: Date.now(),
  })

  const finalId = await db.magic.card.save(toInsert)
  const finalizedCard = await db.magic.card.findById(finalId)

  res.json({
    status: 'success',
    cardCreated,
    cardReplaced: !cardCreated, // The cube containing this card should be updated, probably.
    finalizedCard,
  })
}

/**
 * Get card versions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.versions = async (req, res) => {
  const versions = await db.magic.card.versions()
  res.json({
    status: 'success',
    versions,
  })
} 

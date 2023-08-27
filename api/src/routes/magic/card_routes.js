const db = require('../../models/db.js')
const { mag } = require('battlestar-common')

const Card = {}


Card.fetchAll = async function(req, res) {
  const cardData = await db.magic.card.fetchAll(req.body.source)

  res.json({
    status: 'success',
    ...cardData
  })
}

Card.save = async function(req, res) {
  const { card, original, editor, comment } = req.body

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

Card.versions = async function(req, res) {
  const versions = await db.magic.card.versions()
  res.json({
    status: 'success',
    versions,
  })
}

module.exports = Card

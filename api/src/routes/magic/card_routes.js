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

  // You can't edit a Scryfall card. Create a copy of the Scryfall card and update that.
  let toUpdate
  if (replaceScryfallCard) {
    toUpdate = await db.magic.card.insertCustom(original)
  }
  else if (original) {
    toUpdate = await db.magic.card.findById(original._id)
  }
  else {
    toUpdate = await db.magic.card.findById(card._id)
  }

  // Save the past edits.
  const prevEdits = toUpdate.edits || []

  // Remove fields that should not be altered.
  delete card._id
  delete card.custom_id
  delete card.edits
  delete card.set
  delete card.collector_number
  delete card.legal

  console.log({ card, toUpdate })

  // Update the card model.
  const final = {
    ...toUpdate,
    ...card
  }


  // Update the edit history.
  final.edits = final.edits || []
  final.edits.push({
    editor,
    comment: comment || 'no comment',
    timestamp: Date.now(),
  })

  await db.magic.card.save(final)

  res.json({
    status: 'success',
    cardReplaced: replaceScryfallCard,
    finalizedCard: final,
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

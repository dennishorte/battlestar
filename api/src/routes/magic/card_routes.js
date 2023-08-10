const db = require('../../models/db.js')
const { mag } = require('battlestar-common')

const Card = {}

Card.create = async function(req, res) {
  const { cubeId, card, replace } = req.body
  const cube = await db.magic.cube.findById(cubeId)

  if (replace) {
    await _insertOriginalCardReference(card)
    await db.magic.cube.removeCard(cubeId, card.original)
  }

  const inserted = await db.magic.card.insertCustom(card)
  console.log(2, inserted)

  // Add the new card to the cube
  const cardId = mag.util.card.createCardIdDict(inserted)
  await db.magic.cube.addCard(cubeId, cardId)

  res.json({
    status: 'success',
  })
}


Card.fetchAll = async function(req, res) {
  const cardData = await db.magic.card.fetchAll(req.body.source)

  res.json({
    status: 'success',
    ...cardData
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


async function _insertOriginalCardReference(card) {
  if (card._id) {
    const original = await db.magic.card.findById(card._id)
    delete card._id

    card.original = {
      name: original.name,
      set: original.set,
      collector_number: original.collector_number,
    }

    if (original.custom_id) {
      card.original.custom_id = original.custom_id
      return false
    }
    else {
      return true
    }
  }

  else {
    return false
  }
}

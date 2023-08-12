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
  const { cubeId, card, original } = req.body
  const cube = await db.magic.cube.findById(cubeId)

  if (original) {
    const originalIdDict = mag.util.card.createCardIdDict(original)
    card.original = originalIdDict
    await db.magic.cube.removeCard(cubeId, originalIdDict)
  }

  const inserted = await db.magic.card.insertCustom(card)

  // Add the new card to the cube
  const cardId = mag.util.card.createCardIdDict(inserted)
  await db.magic.cube.addCard(cubeId, cardId)

  res.json({
    status: 'success',
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

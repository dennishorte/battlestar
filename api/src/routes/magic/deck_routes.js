const db = require('../../models/db.js')

const Deck = {}


Deck.create = async function(req, res) {
  const deckId = await db.magic.deck.create(req.body)
  const deck = await db.magic.deck.findById(deckId)

  res.json({
    status: 'success',
    deck,
  })
}

Deck.fetch = async function(req, res) {
  const deck = await db.magic.deck.findById(req.body.deckId)
  res.json({
    status: 'success',
    deck,
  })
}

Deck.save = async function(req, res) {
  await db.magic.deck.save(req.body.deck)
  res.json({
    status: 'success',
  })
}

Deck.addCard = async function(req, res) {
  await db.magic.deck.addCard(req.body.deckId, req.body.card)
  res.json({
    status: 'success',
  })
}


module.exports = Deck

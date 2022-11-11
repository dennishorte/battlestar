const db = require('../models/db.js')

const Deck = {}


Deck.create = async function(req, res) {
  const deckId = await db.deck.create(req.body)
  const deck = await db.deck.findById(deckId)

  res.json({
    status: 'success',
    deck,
  })
}

Deck.save = async function(req, res) {
  await db.deck.save(req.body.deck)
  res.json({
    status: 'success',
  })
}


module.exports = Deck

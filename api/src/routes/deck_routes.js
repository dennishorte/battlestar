const db = require('../models/db.js')

const Deck = {}


Deck.create = async function(req, res) {
  const deckId = await db.deck.create({
    userId: req.body.userId,
    name: req.body.name,
    path: req.body.path,
  })

  const deck = await db.deck.findById(deckId)

  res.json({
    status: 'success',
    deck,
  })
}


module.exports = Deck

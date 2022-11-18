const db = require('../../models/db.js')

const Card = {}


Card.fetchAll = async function(req, res) {
  const cursor = await db.magic.scryfall.fetchAll()
  const cards = await cursor.toArray()

  res.json({
    status: 'success',
    cards,
  })
}

module.exports = Card

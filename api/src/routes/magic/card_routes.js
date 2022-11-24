const db = require('../../models/db.js')

const Card = {}


Card.fetchAll = async function(req, res) {
  const cards = await db.magic.card.fetchAll()

  res.json({
    status: 'success',
    cards,
  })
}

module.exports = Card

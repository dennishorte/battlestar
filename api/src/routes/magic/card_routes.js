const db = require('../../models/db.js')

const Card = {}


Card.fetchAll = async function(req, res) {
  const { cards, version } = await db.magic.card.fetchAll()

  res.json({
    status: 'success',
    cards,
    version,
  })
}

Card.version = async function(req, res) {
  const version = await db.magic.card.version()
  res.json({
    status: 'success',
    version,
  })
}

module.exports = Card

const db = require('../models/db.js')

const Scryfall = {}

Scryfall.updateAll = async function(req, res) {
  await db.scryfall.updateAll()
  res.json({
    status: 'success',
    message: 'Scryfall data updated'
  })
}

module.exports = Scryfall

const db = require('../../models/db.js')

const Scryfall = {}

Scryfall.updateAll = async function(req, res) {
  const result = await db.magic.scryfall.updateAll()
  res.json({
    status: 'success',
    message: 'Scryfall data updated',
    ...result,
  })
}

module.exports = Scryfall

const db = require('../../models/db.js')

const Hex = {}


Hex.all = async function(req, res) {
  const hexes = await db.tyrants.hex.fetchAll()
  res.json({
    status: 'success',
    hexes,
  })
}

Hex.delete = async function(req, res) {
  await db.tyrants.hex.delete(req.body.id)
  res.json({
    status: 'success',
  })
}

Hex.save = async function(req, res) {
  await db.tyrants.hex.save(req.body.hex)
  res.json({
    status: 'success',
  })
}

module.exports = Hex

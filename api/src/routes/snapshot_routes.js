const db = require('../models/db.js')

const Snapshot = {}
module.exports = Snapshot


Snapshot.create = async function(req, res) {
  const game = await db.game.findById(req.body.gameId)
  await db.snapshot.create(game)
  res.json({
    status: 'success',
    message: 'Snapshot created',
  })
}

Snapshot.fetch = async function(req, res) {
  const snapshots = await db.snapshot.findByGameId(req.body.gameId)
  const array = await snapshots.toArray()
  res.json({
    status: 'success',
    snapshots: array,
  })
}

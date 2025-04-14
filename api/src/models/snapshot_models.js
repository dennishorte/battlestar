// Database and collection
const databaseClient = require('../utils/mongo.js').client
const database = databaseClient.db('games')
const snapshotCollection = database.collection('snapshot')

const Snapshot = {}
module.exports = Snapshot

Snapshot.create = async function(game) {
  const snapshot = {
    game,
    timestamp: Date.now(),
  }

  const insertResult = await snapshotCollection.insertOne(snapshot)
  return insertResult.insertedId
}

Snapshot.findByGameId = async function(gameId) {
  return await snapshotCollection.find({ "game._id": gameId })
}

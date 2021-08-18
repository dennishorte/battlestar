// Database and collection
const databaseClient = require('../util/mongo.js').client
const lobbyDatabase = databaseClient.db('lobby')
const lobbyCollection = lobbyDatabase.collection('lobby')

// Exports
const Lobby = {}
module.exports = Lobby


Lobby.factory = function() {
  return {
    name: 'New Lobby',
    createdTimestamp: Date.now(),
    userIds: [],
    game: null,
    options: {},
  }
}

Lobby.all = async function() {
  return await lobbyCollection.find({})
}

Lobby.addUser = async function(lobbyId, userId) {
  const filter = { _id: lobbyId }
  const updater = { $addToSet: { userIds: userId } }
  const updateResult = await lobbyCollection.updateOne(filter, updater)
  return updateResult
}

Lobby.create = async function(lobbyDict) {
  const insertResult = await lobbyCollection.insertOne(Lobby.factory())
  return insertResult.insertedId
}

Lobby.findById = async function(lobbyId) {
  return await lobbyCollection.findOne({ _id: lobbyId })
}

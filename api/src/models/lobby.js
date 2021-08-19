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

Lobby.addUsers = async function(lobbyId, userIds) {
  const filter = { _id: lobbyId }
  const updater = { $addToSet: { userIds: { $each: userIds } } }
  const updateResult = await lobbyCollection.updateOne(filter, updater)
  return updateResult
}

Lobby.all = async function() {
  return await lobbyCollection.find({})
}

Lobby.create = async function(lobbyDict) {
  const insertResult = await lobbyCollection.insertOne(Lobby.factory())
  return insertResult.insertedId
}

Lobby.findById = async function(lobbyId) {
  return await lobbyCollection.findOne({ _id: lobbyId })
}

Lobby.removeUsers = async function(lobbyId, userIds) {
  const filter = { _id: lobbyId }
  const updater = { $pull: { userIds: { $in: userIds } } }
  const updateResult = await lobbyCollection.updateOne(filter, updater)
  return updateResult
}

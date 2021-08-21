const Haikunator = require('haikunator')
const haikunator = new Haikunator()

// Database and collection
const databaseClient = require('../util/mongo.js').client
const lobbyDatabase = databaseClient.db('lobby')
const lobbyCollection = lobbyDatabase.collection('lobby')

// Exports
const Lobby = {}
module.exports = Lobby


Lobby.factory = function() {
  return {
    name: haikunator.haikunate({tokenLength: 0}),
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

Lobby.findByUserId = async function(userId) {
  return await lobbyCollection.find({ userIds: userId })
}

Lobby.nameUpdate = async function(lobbyId, name) {
  const filter = { _id: lobbyId }
  const updater = { $set: { name } }
  return await lobbyCollection.updateOne(filter, updater)
}

Lobby.removeUsers = async function(lobbyId, userIds) {
  const filter = { _id: lobbyId }
  const updater = { $pull: { userIds: { $in: userIds } } }
  return await lobbyCollection.updateOne(filter, updater)
}

Lobby.updateSettings = async function(lobbyId, game, options) {
  const filter = { _id: lobbyId }
  const updater = { $set: { game, options } }
  return await lobbyCollection.updateOne(filter, updater)
}

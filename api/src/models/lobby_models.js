const Haikunator = require('haikunator')
const haikunator = new Haikunator()

// Database and collection
const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const lobbyCollection = database.collection('lobby')

// Exports
const Lobby = {}
module.exports = Lobby


Lobby.factory = function() {
  return {
    name: haikunator.haikunate({tokenLength: 0}),
    createdTimestamp: Date.now(),
    users: [],
    game: null,
    options: {},
    valid: false,
    gameLaunched: false,
  }
}

Lobby.all = async function() {
  return await lobbyCollection.find({})
}

Lobby.create = async function() {
  const insertResult = await lobbyCollection.insertOne(Lobby.factory())
  return insertResult.insertedId
}

Lobby.findById = async function(lobbyId) {
  return await lobbyCollection.findOne({ _id: lobbyId })
}

Lobby.findByUserId = async function(userId) {
  return await lobbyCollection.find({
    'users._id': userId,
    gameLaunched: false,
  })
}

Lobby.gameLaunched = async function(lobbyId, gameId) {
  const filter = { _id: lobbyId }
  const updater = { $set: {
    gameLaunched: true,
    gameId: gameId,
  } }
  return await lobbyCollection.updateOne(filter, updater)
}

Lobby.kill = async function(lobby) {
  const filter = { _id: lobby._id }
  await lobbyCollection.deleteOne(filter)
}

Lobby.save = async function(lobby) {
  const orig = await this.findById(lobby._id)

  if (!orig) {
    throw new Error('Lobby does not exist in db. Cannot save: ' + lobby._id)
  }

  return await lobbyCollection.replaceOne(
    { _id: lobby._id },
    lobby,
  )
}

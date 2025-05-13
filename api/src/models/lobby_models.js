const Haikunator = require('haikunator')
const haikunator = new Haikunator()
const databaseClient = require('#/utils/mongo.js').client

// Database and collection
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

Lobby.gameLaunched = async function(lobby, game) {
  const filter = { _id: lobby._id }
  const updater = { $set: {
    gameLaunched: true,
    gameId: game._id,
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

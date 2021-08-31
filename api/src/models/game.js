// Database and collection
const databaseClient = require('../util/mongo.js').client
const gameDatabase = databaseClient.db('game')
const gameCollection = gameDatabase.collection('game')

const Game = {}
module.exports = Game


function _factory(lobby) {
  return {
    game: lobby.game,
    name: lobby.name,
    options: lobby.options,
    userIds: lobby.userIds,
    createdTimestamp: Date.now(),
    initialized: false,
  }
}

Game.create = async function(lobby) {
  const insertResult = await gameCollection.insertOne(_factory(lobby))
  return insertResult.insertedId
}

Game.findById = async function(gameId) {
  return await gameCollection.findOne({ _id: gameId })
}

Game.findByUserId = async function(userId) {
  return await gameCollection.find({ userIds: userId })
}

Game.save = async function(record) {
  return await gameCollection.replaceOne({ _id: record._id}, record)
}

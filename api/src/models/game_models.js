const { Mutex } = require('../util/mutex.js')
const common = require('battlestar-common')

// Database and collection
const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const gameCollection = database.collection('game')

const writeMutex = new Mutex()

const Game = {}
module.exports = Game


function _factory(lobby) {
  switch (lobby.game) {
    case 'Battlestar Galactica':
      return common.bsg.factory(lobby)
    case 'Innovation':
      return common.inn.factory(lobby)
    default:
      throw new Error(`Unknown game: ${lobby.game}`)
  }
}

Game.create = async function(lobby) {
  return await writeMutex.dispatch(async () => {
    const data = _factory(lobby)
    data.settings.createdTimestamp = Date.now()
    const insertResult = await gameCollection.insertOne(data)
    return insertResult.insertedId
  })
}

Game.findById = async function(gameId) {
  return await gameCollection.findOne({ _id: gameId })
}

Game.findByUserId = async function(userId) {
  return await gameCollection.find({ $or: [
    { 'users._id': userId },  // bsg
    { 'settings.players._id': userId },  // innovation
  ]})
}

Game.save = async function(record) {
  return await writeMutex.dispatch(async () => {
    const old = await Game.findById(record._id)

    if (!old.saveKey) {
      record.saveKey = 0
    }
    else if (old.saveKey !== record.saveKey) {
      throw new Error("Save key mismatch. Unable to save.")
    }

    record.saveKey += 1
    await gameCollection.replaceOne({ _id: record._id}, record)

    return record.saveKey
  })
}

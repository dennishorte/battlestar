const { fromData, fromLobby } = require('battlestar-common')
const { ObjectId } = require('mongodb')
const AsyncLock = require('async-lock')
const databaseClient = require('../utils/mongo.js').client

// Database and collection
const database = databaseClient.db('games')
const gameCollection = database.collection('game')

const Game = {
  collection: gameCollection,
}
module.exports = Game


Game.all = async function() {
  return await gameCollection.find({})
}

Game.create = async function(lobby) {
  const data = fromLobby(lobby)
  data.settings.createdTimestamp = Date.now()

  // Added in order to support showing games that have recently ended on user home screens.
  data.lastUpdated = data.settings.createdTimestamp

  const insertResult = await gameCollection.insertOne(data)

  // Need to actually run the game once to make sure 'waiting' field is populated.
  const gameData = await this.findById(insertResult.insertedId)
  const game = fromData(gameData)
  game.run()

  await this.save(game, { noMutex: true })

  return game._id
}

Game.find = async function(filters) {
  return await gameCollection.find(filters)
}

Game.findById = async function(gameId) {
  return await gameCollection.findOne({
    _id: gameId,
    killed: { $ne: true },
  })
}

Game.findByUserId = async function(userId) {
  return await gameCollection.find({
    'settings.players._id': userId,
    gameOver: false
  })
}

Game.findRecentlyFinishedByUserId = async function(userId) {
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000

  return await gameCollection.find({
    'settings.players._id': userId,
    gameOver: true,
    killed: { $ne: true },
    lastUpdated: { $gt: threeDaysAgo }
  })
}

Game.findWaitingByUserId = async function(userId) {
  return await gameCollection.find({ waiting: userId })
}

Game.gameOver = async function(game, killed=false) {
  const setValues = { gameOver: true }

  if (killed) {
    setValues.killed = true
  }

  await gameCollection.updateOne(
    { _id: game._id },
    { $set: setValues },
  )

  // Hook to release scars from cube draft games.
}

Game.linkDraftToGame = async function(draft, game) {
  if (draft.linkedGames) {
    await gameCollection.updateOne(
      { _id: draft._id },
      { $addToSet: { linkedGames: game._id } }
    )
  }
  else {
    await gameCollection.updateOne(
      { _id: draft._id },
      { $set: { linkedGames: [game._id] } }
    )
  }
}

Game.linkGameToDraft = async function(game, draft) {
  await gameCollection.updateOne(
    { _id: game._id },
    { $set: { 'settings.linkedDraftId': draft._id } },
  )
}

Game.save = async function(game, opts={}) {
  const branchId = Date.now()
  game.branchId = branchId

  await gameCollection.updateOne(
    { _id: game._id },
    {
      $set: {
        branchId,
        gameOver: game.gameOver,
        gameOverData: game.gameOverData,
        lastUpdated: Date.now(),
        chat: game.chat,
        responses: game.responses,
        waiting: game.getPlayerNamesWaiting(),
      }
    },
  )

  return { branchId }
}

Game.saveSettings = async function(game, settings) {
  return await gameCollection.updateOne(
    { _id: game._id },
    { $set: { settings } }
  )
}

Game.saveStats = async function(gameData) {
  return await gameCollection.updateOne(
    { _id: gameData._id },
    { $set: { stats: gameData.stats } },
  )
}

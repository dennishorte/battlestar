const { fromData, fromLobby } = require('battlestar-common')
const AsyncLock = require('async-lock')

// Database and collection
const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const gameCollection = database.collection('game')

const lock = new AsyncLock()

const Game = {
  collection: gameCollection,
}
module.exports = Game


Game.all = async function() {
  return await gameCollection.find({})
}

Game.create = async function(lobby) {
  return await lock.acquire(lobby._id, async () => {
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
  })
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

Game.gameOver = async function(gameId, killed=false) {
  return await lock.acquire(gameId, async () => {
    const setValues = { gameOver: true }

    if (killed) {
      setValues.killed = true
    }

    await gameCollection.updateOne(
      { _id: gameId },
      { $set: setValues },
    )

    // Hook to release scars from cube draft games.
  })
}

Game.linkDraftToGame = async function(draftId, gameId) {
  await lock.acquire(draftId, async () => {
    const draft = this.findById(draftId)
    if (draft.linkedGames) {
      await gameCollection.updateOne(
        { _id: draftId },
        { $addToSet: { linkedGames: gameId } }
      )
    }
    else {
      await gameCollection.updateOne(
        { _id: draftId },
        { $set: { linkedGames: [gameId] } }
      )
    }
  })
}

Game.linkGameToDraft = async function(gameId, draftId) {
  await lock.acquire(draftId, async () => {
    await gameCollection.updateOne(
      { _id: gameId },
      { $set: { 'settings.linkedDraftId': draftId } },
    )
  })
}

async function doSave(game) {
  const branchId = Date.now()

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

Game.save = async function(game, opts={}) {
  if (opts.noMutex) {
    return await doSave(game)
  }
  else {
    return await lock.acquire(game._id, async () => {
      return await doSave(game)
    })
  }
}

Game.saveSettings = async function(gameId, settings) {
  return await gameCollection.updateOne(
    { _id: gameId },
    { $set: { settings } }
  )
}

Game.saveStats = async function(gameData) {
  return await gameCollection.updateOne(
    { _id: gameData._id },
    { $set: { stats: gameData.stats } },
  )
}

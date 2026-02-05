import { fromData, fromLobby } from 'battlestar-common'
import { client as databaseClient } from '../utils/mongo.js'
import { shouldUpdateBranchId } from '../utils/branchId.js'

// Database and collection
const database = databaseClient.db('games')
const gameCollection = database.collection('game')

const Game = {
  collection: gameCollection,
}

Game.all = async function() {
  return await gameCollection.find({})
}

Game.create = async function(lobby) {
  const data = fromLobby(lobby).serialize()
  data.settings.createdTimestamp = Date.now()

  // Added in order to support showing games that have recently ended on user home screens.
  data.lastUpdated = data.settings.createdTimestamp

  const insertResult = await gameCollection.insertOne(data)

  return insertResult.insertedId
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
  else {
    // Save stats when game ends normally (not killed)
    setValues.stats = {
      error: false,
      result: {
        player: { name: game.gameOverData?.player },
        reason: game.gameOverData?.reason,
      },
      inGame: game.stats || {},
    }
  }

  await gameCollection.updateOne(
    { _id: game._id },
    { $set: setValues },
  )
}

Game.insert = async function(data) {
  const game = fromData(data)
  game.run()

  delete game.settings.linkedDraftId
  delete game.settings.links

  const waitingState = game.getWaitingState ? game.getWaitingState() : null
  const { insertedId } = await gameCollection.insertOne({
    branchId: game.branchId,
    chat: game.log.getChat(),
    gameOver: game.gameOver,
    gameOverData: game.gameOverData,
    overwrite: game.overwrite,
    responses: game.responses,
    settings: game.settings,
    waiting: game.waiting.selectors.map(s => s.actor),
    waitingConcurrent: waitingState?.concurrent ?? false,
  })
  return insertedId
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

Game.save = async function(game, previousWaitingState = null) {
  const currentWaitingState = game.getWaitingState ? game.getWaitingState() : null

  // Determine if branchId should update based on waiting state changes
  const branchIdShouldUpdate = shouldUpdateBranchId(previousWaitingState, currentWaitingState)
  const branchId = branchIdShouldUpdate ? Date.now() : game.branchId
  game.branchId = branchId

  const waitingState = game.getWaitingState ? game.getWaitingState() : null
  await gameCollection.updateOne(
    { _id: game._id },
    {
      $set: {
        branchId,
        gameOver: game.gameOver,
        gameOverData: game.gameOverData,
        lastUpdated: Date.now(),
        chat: game.log.getChat(),
        responses: game.responses,
        waiting: game.getPlayerNamesWaiting(),
        waitingConcurrent: waitingState?.concurrent ?? false,
      }
    },
  )

  return game
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

export default Game

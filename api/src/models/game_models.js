const { Mutex } = require('../util/mutex.js')
const common = require('battlestar-common')

// Database and collection
const databaseClient = require('../util/mongo.js').client
const database = databaseClient.db('games')
const gameCollection = database.collection('game')

const writeMutex = new Mutex()

const Game = {
  collection: gameCollection,
}
module.exports = Game


function _factory(lobby) {
  switch (lobby.game) {

    case 'Set Draft':
    case 'Cube Draft':
      return common.mag.draft.cube.factory(lobby)

    case 'Innovation':
      return common.inn.factory(lobby)

    case 'Magic':
      return common.mag.factory(lobby)

    case 'Tyrants of the Underdark':
      return common.tyr.factory(lobby)

    default:
      throw new Error(`Unknown game: ${lobby.game}`)
  }
}

Game.all = async function() {
  return await gameCollection.find({})
}

Game.create = async function(lobby) {
  return await writeMutex.dispatch(async () => {
    const data = _factory(lobby)
    data.settings.createdTimestamp = Date.now()

    // Added in order to support showing games that have recently ended on user home screens.
    data.lastUpdated = data.settings.createdTimestamp

    const insertResult = await gameCollection.insertOne(data)

    // Need to actually run the game once to make sure 'waiting' field is populated.
    const gameData = await this.findById(insertResult.insertedId)
    let game
    if (gameData.settings.game === 'CubeDraft') {
      game = new common.mag.draft.cube.CubeDraft(gameData)
    }
    else if (gameData.settings.game === 'Innovation') {
      game = new common.inn.Innovation(gameData)
    }
    else if (gameData.settings.game === 'Magic') {
      game = new common.mag.Magic(gameData)
    }
    else if (gameData.settings.game === 'Tyrants of the Underdark') {
      game = new common.tyr.Tyrants(gameData)
    }
    else {
      throw new Error(`Can't run unknown game ${gameData.settings.game}`)
    }
    game.run()
    await this.save(game, { noMutex: true })

    return game._id
  })
}

Game.find = async function(filters) {
  return await gameCollection.find(filters)
}

Game.findById = async function(gameId) {
  return await gameCollection.findOne({ _id: gameId })
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
  return await writeMutex.dispatch(async () => {
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
  await writeMutex.dispatch(async () => {
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
  await writeMutex.dispatch(async () => {
    await gameCollection.updateOne(
      { _id: gameId },
      { $set: { 'settings.linkedDraftId': draftId } },
    )
  })
}

async function doSave(game) {
  return await gameCollection.updateOne(
    { _id: game._id },
    {
      $set: {
        gameOver: game.gameOver,
        gameOverData: game.gameOverData,
        lastUpdated: Date.now(),
        responses: game.responses,
        waiting: game.getPlayerNamesWaiting(),
      }
    },
  )
}

Game.save = async function(game, opts={}) {
  if (opts.noMutex) {
    return await doSave(game)
  }
  else {
    return await writeMutex.dispatch(async () => {
      await doSave(game)
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
  return await writeMutex.dispatch(async () => {
    await gameCollection.updateOne(
      { _id: gameData._id },
      { $set: { stats: gameData.stats } },
    )
  })
}

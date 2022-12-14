const db = require('../models/db.js')
const slack = require('../util/slack.js')

const { GameOverEvent, inn, mag, tyr } = require('battlestar-common')

const Game = {}
module.exports = Game

const statsVersion = 2


Game.create = async function(req, res) {
  const lobby = await db.lobby.findById(req.body.lobbyId)

  if (lobby.gameLaunched) {
    res.json({
      status: 'error',
      message: 'Game already created'
    })
    return
  }

  const gameId = await db.game.create(lobby)

  if (gameId) {
    // Save the game id in the lobby
    await db.lobby.gameLaunched(lobby._id, gameId)

    // Notify players of the new game
    const game = await db.game.findById(gameId)
    for (const user of lobby.users) {
      _notify(game, user._id, 'A new game has started!')
    }

    res.json({
      status: 'success',
      gameId,
    })
  }
  else {
    res.json({
      status: 'error',
      message: 'Error creating game',
    })
  }
}

Game.fetch = async function(req, res) {
  const game = await db.game.findById(req.body.gameId)
  res.json({
    status: 'success',
    game,
  })
}

Game.fetchAll = async function(req, res) {
  const cursor = await db.game.all()
  const games = await cursor.toArray()
  res.json({
    status: 'success',
    games
  })
}

Game.kill = async function(req, res) {
  await db.game.gameOver(req.body.gameId, true)
  res.json({
    status: 'success',
  })
}

async function _notify(game, userId, msg) {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const gameKind = game.settings ? game.settings.game : game.game
  const gameName = game.settings ? game.settings.name : game.name

  const domain_host = process.env.DOMAIN_HOST
  const link = `http://${domain_host}/game/${game._id}`
  const message = `${msg} <${link}|${gameKind}: ${gameName}>`

  const sendResult = slack.sendMessage(userId, message)
}

Game.rematch = async function(req, res) {
  const game = await db.game.findById(req.body.gameId)
  const lobbyId = await db.lobby.create()
  const lobby = await db.lobby.findById(lobbyId)

  lobby.game = game.settings.game
  lobby.users = game.settings.players

  const nonOptionKeys = [
    'createdTimestamp',
    'game',
    'name',
    'players',
    'seed',
  ]

  for (const key of Object.keys(game.settings)) {
    if (!nonOptionKeys.includes(key)) {
      lobby.options[key] = game.settings[key]
    }
  }

  await db.lobby.save(lobby)

  res.json({
    status: 'success',
    redirect: `/lobby/${lobbyId}`,
  })
}

Game.saveFull = async function(req, res) {
  const game = await _loadGameFromReq(req)
  game.responses = req.body.responses
  game.chat = req.body.chat

  // Magic doesn't run when saving because that would require loading the card
  // database, which is slow.
  if (game.settings.game === 'Magic') {
    game.waiting = req.body.waiting
    game.gameOver = req.body.gameOver
    game.gameOverData = req.body.gameOverData
    await _testAndSave(game, res, () => {})
  }
  else {
    await _testAndSave(game, res, (game) => {
      game.run()
    })
  }
}

Game.updateStats = async function(req, res) {
  const cursor = await db.game.all()
  const games = await cursor.toArray()
  let numUpdated = 0

  for (const data of games) {
    if (updateStatsOne(data)) {
      numUpdated += 1
    }
  }

  res.json({
    status: 'success',
    count: numUpdated,
    message: `Updated stats for ${numUpdated} games`,
  })
}


////////////////////////////////////////////////////////////////////////////////
// Helper functions

async function _testAndSave(game, res, evalFunc) {
  // Test that the response is valid.
  let valid = false
  let message = ''
  try {
    evalFunc(game)
  }
  catch (e) {
    if (e instanceof inn.GameOverEvent) {
      // Do nothing
    }
    else {
      throw e
    }
  }

  await db.game.save(game)
  await updateStatsOne(game)
  if (game.checkGameIsOver()) {
    await db.game.gameOver(game._id)
  }
  await _sendNotifications(res, game)
}

async function updateStatsOne(data) {
  switch (data.settings.game) {
    case 'Innovation':
      return updateStatsOneInnovation(data)

    case 'Magic':
      return updateStatsOneMagic(data)

    case 'Tyrants of the Underdark':
      return updateStatsOneTyrants(data)

    default:
      return false;
  }
}

async function updateStatsOneMagic(data) {
  if (
    !data.stats
    || data.stats.version !== statsVersion
    || (data.gameOver === true && data.stats.gameOver === false)
  ) {

    data.stats = {
      version: statsVersion,
      error: false,
    }

    if (data.gameOver) {
      data.stats.gameOver = true
      data.stats.result = data.gameOverData
    }
    else {
      data.stats.gameOver = false
    }

    await db.game.saveStats(data)
    return true
  }

  else {
    return false
  }
}

async function updateStatsOneInnovation(data) {
  if (
    !data.stats
    || data.stats.version !== statsVersion
    || (data.gameOver === true && data.stats.gameOver === false)
  ) {

    data.stats = {
      version: statsVersion,
      error: false,
    }

    const game = new inn.Innovation(data)
    let result
    try {
      result = game.run()
    }
    catch {
      data.stats.error = true
      await db.game.saveStats(data)
      return true
    }

    if (result instanceof GameOverEvent) {
      data.stats.gameOver = true
      data.stats.result = result.data
    }
    else {
      data.stats.gameOver = false
    }

    await db.game.saveStats(data)
    return true
  }

  else {
    return false
  }
}

async function updateStatsOneTyrants(data) {
  if (
    !data.stats
    || data.stats.version !== statsVersion
    || (data.gameOver === true && data.stats.gameOver === false)
  ) {

    data.stats = {
      version: statsVersion,
      error: false,
    }

    const game = new tyr.Tyrants(data)
    let result
    try {
      result = game.run()
    }
    catch {
      data.stats.error = true
      await db.game.saveStats(data)
      return true
    }

    if (result instanceof GameOverEvent) {
      data.stats.gameOver = true
      data.stats.result = result.data
    }
    else {
      data.stats.gameOver = false
    }

    await db.game.saveStats(data)
    return true
  }

  else {
    return false
  }
}

async function _loadGameFromReq(req) {
  const gameData = await db.game.findById(req.body.gameId)

  if (gameData.settings.game === 'Innovation') {
    return new inn.Innovation(gameData)
  }
  else if (gameData.settings.game === 'Tyrants of the Underdark') {
    return new tyr.Tyrants(gameData)
  }
  else if (gameData.settings.game === 'Magic') {
    return new mag.Magic(gameData)
  }
  else {
    throw new Error(`Unhandled game type: ${gameData.settings.game}`)
  }
}

async function _sendNotifications(res, game) {
  for (const player of game.settings.players) {
    if (game.checkGameIsOver()) {
      _notify(game, player._id, 'Game Over!')
    }

    else if (
      game.checkPlayerHasActionWaiting(player)
      && !game.checkLastActorWas(player)
    ) {
      _notify(game, player._id, "You're up!")
    }
  }

  res.json({
    status: 'success',
    message: 'Saved',
  })
}

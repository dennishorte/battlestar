const db = require('../models/db.js')
const slack = require('../util/slack.js')

const { inn } = require('battlestar-common')

const Game = {}
module.exports = Game


Game.create = async function(req, res) {
  const lobby = await db.lobby.findById(req.body.lobbyId)
  const gameId = await db.game.create(lobby)

  if (gameId) {
    // Save the game id in the lobby
    db.lobby.gameLaunched(lobby.id, gameId)

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

Game.saveFull = async function(req, res) {
  await db.game.saveResponses(req.body.gameId, req.body.responses)
  const game = await _loadGameFromReq(req)
  game.run()
  await _sendNotifications(res, game)
}

Game.saveResponse = async function(req, res) {
  const game = await _loadGameFromReq(req)

  // Test that the response is valid.
  let valid = false
  let message = ''
  try {
    game.run()
    game.respondToInputRequest(req.body.response)
    valid = true
  }
  catch (e) {
    if (e instanceof inn.GameOverEvent) {
      valid = true
    }
    else {
      message = e.message
    }
  }

  if (valid) {
    await db.game.saveResponses(game._id, game.responses)
    await _sendNotifications(res, game)
  }
  else {
    res.json({
      status: 'error',
      message,
    })
  }

}

async function _loadGameFromReq(req) {
  const gameData = await db.game.findById(req.body.gameId)

  if (gameData.settings.game === 'Innovation') {
    return new inn.Innovation(gameData)
  }
  else {
    throw new Error(`Unhandled game type: ${gameData.settings.game}`)
  }
}

async function _sendNotifications(res, game) {
  for (const player of game.getPlayerAll()) {
    if (game.checkGameIsOver()) {
      _notify(game, player._id, 'Game Over!')
    }

    else if (game.checkPlayerHasActionWaiting(player)) {
      _notify(game, player._id, "You're up!")
    }
  }

  res.json({
    status: 'success',
    message: 'Saved',
  })
}

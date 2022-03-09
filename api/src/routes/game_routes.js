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

Game.notify = async function(req, res) {
  const userId = req.body.userId
  const game = await db.game.findById(req.body.gameId)
  const gameKind = game.settings ? game.settings.game : game.game
  const gameName = game.settings ? game.settings.name : game.name

  const domain_host = process.env.DOMAIN_HOST
  const link = `http://${domain_host}/game/${game._id}`
  const message = `You're up! <${link}|${gameKind}: ${gameName}>`

  const sendResult = slack.sendMessage(userId, message)

  res.json({
    status: 'success',
  })
}

Game.save = async function(req, res) {
  try {
    const newSaveKey = await db.game.save(req.body)

    res.json({
      status: 'success',
      saveKey: newSaveKey,
    })
  }
  catch (e) {
    res.json({
      status: 'error',
      message: e.message,
    })
  }
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
    await db.game.saveResponse(game._id, req.body.response)
    res.json({
      status: 'success',
      message: 'Saved',
    })
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

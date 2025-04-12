const db = require('../models/db.js')
const stats = require('../util/stats.js')
const gameService = require('../services/game_service.js')

const { GameOverEvent, fromData } = require('battlestar-common')

const Game = {
  stats: {}
}
module.exports = Game


Game.create = async function(req, res) {
  const lobby = req.lobby
  const game = await gameService.create(lobby, req.body.linkedDraftId)
  return res.json({
    status: 'success',
    gameId: game._id,
  })
}

Game.fetch = async function(req, res) {
  return res.json({
    status: 'success',
    game: req.game.serialize(),
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
  await gameService.kill(req.game)
  res.json({
    status: 'success',
  })
}

Game.rematch = async function(req, res) {
  const lobby = await gameService.rematch(req.game)
  res.json({
    status: 'success',
    lobbyId: lobby._id
  })
}

Game.saveFull = async function(req, res) {
  const serializedGame = await gameService.saveFull(req.game, {
    chat: req.body.chat,
    responses: req.body.responses,
    waiting: req.body.waiting,
    gameOver: req.body.gameOver,
    gameOverData: req.body.gameOverData,
    branchId: req.body.branchId,
    overwrite: req.body.overwrite,
  })
  res.json({
    status: 'success',
    serializedGame,
  })
}

Game.saveResponse = async function(req, res) {
  const serializedGame = await gameService.saveResponse(req.game, req.body.response)
  res.json({
    status: 'success',
    serializedGame,
  })
}

Game.undo = async function(req, res) {
  const serializedGame = await gameService.undo(req.game, req.body.count)
  return res.json({
    status: 'success',
    serializedGame,
  })
}

Game.stats.innovation = async function(req, res) {
  const cursor = await db.game.find(
    {
      'settings.game': 'Innovation',
      'settings.players.2': { $exists: false }, // Two player games only
      'stats.error': false,
      gameOver: true,
      killed: false,
    },
    {
      _id: 0,
      stats: 1,
      settings: 1,
    },
  )

  res.json({
    status: 'success',
    data: await stats.processInnovationStats(cursor),
  })
}

const db = require('../models/db.js')

const Game = {}
module.exports = Game


Game.create = async function(req, res) {
  const lobby = await db.lobby.findById(req.body.lobbyId)
  const gameId = await db.game.create(lobby)

  if (gameId) {
    // Save the game id in the lobby
    db.lobby.gameLaunched(lobby.id)

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

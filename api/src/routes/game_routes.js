const db = require('../models/db.js')
const slack = require('../util/slack.js')
const stats = require('../util/stats.js')

const { GameOverEvent } = require('battlestar-common')

const Game = {
  stats: {}
}
module.exports = Game

async function _maybeHandleCubeDraft(game) {
  if (
    game.settings.game === 'CubeDraft'
    || game.settings.game === 'Cube Draft'
    || game.settings.game === 'Set Draft'
  ) {
    // Create decks for each user.
    for (const player of game.settings.players) {
      const deckId = await db.magic.deck.create({
        userId: player._id,
        path: '/draft_decks',
        name: game.settings.name,
      })

      player.deckId = deckId
    }

    // Save the draft settings afterwards so the deck ids get saved.
    await db.game.saveSettings(game, game.settings)
  }
}

async function _maybeHandleMagicLinks(game, linkedDraftId) {
  if (game.settings.game === 'Magic' && linkedDraftId) {
    await db.game.linkGameToDraft(game, linkedDraftId)
    await db.game.linkDraftToGame(linkedDraftId, game)
  }
}

Game.create = async function(req, res) {
  const lobby = req.lobby

  if (lobby.gameLaunched) {
    res.json({
      status: 'error',
      message: 'Game already created'
    })
    return
  }

  const gameId = await db.game.create(lobby)

  if (gameId) {
    const game = await db.game.findById(gameId)

    // Save the game id in the lobby
    await db.lobby.gameLaunched(lobby, game)

    await _maybeHandleCubeDraft(game)
    await _maybeHandleMagicLinks(game, req.body.linkedDraftId)

    // Notify players of the new game
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
  return res.json({
    status: 'success',
    game: req.game,
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
  await db.game.gameOver(req.game, true)
  res.json({
    status: 'success',
  })
}

Game.rematch = async function(req, res) {
  const game = req.game
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
  const game = req.game

  // Test if the gameData is safe to write to based on this request
  // If games don't have branchIds, they haven't been created in the new
  // system. Once old games are wrapped up, this if clause can be removed.
  if (game.branchId && !req.body.overwrite) {
    if (!req.body.branchId || req.body.branchId !== game.branchId) {
      res.json({
        status: 'game_overwrite',
        reqBranchId: req.body.branchId,
        gameBranchId: game.branchId,
      })
      return
    }
  }

  if (game.killed) {
    res.json({
      status: 'error',
      message: 'This game was killed',
    })
    return
  }

  game.chat = req.body.chat
  game.responses = req.body.responses

  // Magic doesn't run when saving because that would require loading the card
  // database, which is slow.
  if (game.settings.game === 'Magic'
      || game.settings.game === 'CubeDraft'
      || game.settings.game === 'Cube Draft'
      || game.settings.game === 'Set Draft'
  ) {
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

  await _clearNotification(game)
}

Game.saveResponse = async function(req, res) {
  const game = req.game

  if (game.killed) {
    res.json({
      status: 'error',
      message: 'This game was killed',
    })
    return
  }

  await _testAndSave(game, res, (game) => {
    game.respondToInputRequest(req.body.response)
  })

  await _clearNotification(game)
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

Game.undo = async function(req, res) {
  const game = req.game
  for (let i = 0; i < req.body.count; i++) {
    const result = game.undo()
    if (result !== '__SUCCESS__') {
      throw new Error('Error performing undo')
    }
  }

  const { branchId } = await db.game.save(game)
  res.json({
    status: 'success',
    branchId,
  })
}


////////////////////////////////////////////////////////////////////////////////
// Helper functions

async function _clearNotification(game) {
  const playerId = game.getLastActorId()
  await db.user.clearNotification(playerId)
}

async function _testAndSave(game, res, evalFunc) {
  // Test that the response is valid.
  let valid = false
  let message = ''
  try {
    evalFunc(game)
  }
  catch (e) {
    if (e instanceof GameOverEvent) {
      // Do nothing
    }
    else {
      throw e
    }
  }

  const { branchId } = await db.game.save(game)
  if (game.checkGameIsOver()) {
    await db.game.gameOver(game)
  }
  await _sendNotifications(game)


  res.json({
    status: 'success',
    branchId,
  })
}

async function _notify(game, userId, msg, force=false) {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const prevNotification = await db.user.getNotification(userId)
  if (prevNotification && prevNotification.gameId === game._id && !force) {
    return
  }
  else {
    db.user.recordNotification(userId, game)
  }

  const gameKind = game.settings.game
  const gameName = game.settings.name

  const domain_host = process.env.DOMAIN_HOST
  const link = `http://${domain_host}/game/${game._id}`
  const message = `${msg} <${link}|${gameKind}: ${gameName}>`

  const sendResult = slack.sendMessage(userId, message)
}

async function _sendNotifications(game) {
  for (const player of game.settings.players) {
    if (game.checkGameIsOver()) {
      _notify(game, player._id, 'Game Over!', true)
    }

    else if (
      game.checkPlayerHasActionWaiting(player)
      && !game.checkLastActorWas(player)
    ) {
      _notify(game, player._id, "You're up!")
    }
  }
}

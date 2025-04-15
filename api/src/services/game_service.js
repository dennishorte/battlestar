const db = require('../models/db.js')
const notificationService = require('./notification_service.js')

const { GameKilledError, GameOverwriteError } = require('../middleware.js')
const { GameOverEvent, fromData } = require('battlestar-common')


const Game = {}
module.exports = Game


Game.create = async function(lobby, linkedDraftId) {
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

  if (lobby.gameLaunched) {
    throw new Error('Game already created')
  }

  const gameId = await db.game.create(lobby)

  if (gameId) {
    const gameData = await db.game.findById(gameId)
    const game = fromData(gameData)

    // Save the game id in the lobby
    await db.lobby.gameLaunched(lobby, gameData)

    await _maybeHandleCubeDraft(gameData)
    await _maybeHandleMagicLinks(gameData, linkedDraftId)

    await notificationService.sendGameNotifications(game)

    return game
  }
  else {
    throw new Error('Error creating game')
  }
}

Game.kill = async function(game) {
  await db.game.gameOver(game, true)
}

Game.rematch = async function(game) {
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

  return lobby
}

Game.saveFull = async function(game, { branchId, overwrite, chat, responses, waiting, gameOver, gameOverData }) {
  // Test if the gameData is safe to write to based on this request
  // If games don't have branchIds, they haven't been created in the new
  // system. Once old games are wrapped up, this if clause can be removed.
  if (game.branchId && !overwrite) {
    if (!branchId || branchId !== game.branchId) {
      throw new GameOverwriteError('game_overwrite')
    }
  }

  if (game.killed) {
    throw new GameKilledError('game_killed')
  }

  game.chat = chat
  game.responses = responses

  // Magic doesn't run when saving because that would require loading the card
  // database, which is slow.
  if (game.settings.game === 'Magic'
      || game.settings.game === 'CubeDraft'
      || game.settings.game === 'Cube Draft'
      || game.settings.game === 'Set Draft'
  ) {
    game.waiting = waiting
    game.gameOver = gameOver
    game.gameOverData = gameOverData
    return await _testAndSave(game, () => {})
  }
  else {
    return await _testAndSave(game, () => {
      game.run()
    })
  }
}

Game.saveResponse = async function(game, response) {
  if (game.killed) {
    throw new Error('This game was killed')
  }

  return await _testAndSave(game, () => {
    game.respondToInputRequest(response)
  })
}

Game.undo = async function(game, count) {
  for (let i = 0; i < count; i++) {
    const result = game.undo()
    if (result !== '__SUCCESS__') {
      throw new Error('Error performing undo')
    }
  }

  await db.game.save(game)
  return game.serialize()
}

async function _testAndSave(game, evalFunc) {
  // Test that the response is valid.
  try {
    evalFunc()
  }
  catch (e) {
    if (e instanceof GameOverEvent) {
      // Do nothing
    }
    else {
      throw e
    }
  }

  await db.game.save(game)
  if (game.checkGameIsOver()) {
    await db.game.gameOver(game)
  }

  await notificationService.sendGameNotifications(game)

  return game.serialize()
}

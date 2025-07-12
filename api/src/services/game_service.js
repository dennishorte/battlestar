import db from '../models/db.js'
import notificationService from './notification_service.js'
import { magic, util } from 'battlestar-common'

import { GameKilledError, GameOverwriteError } from '../middleware/loaders.js'
import { GameOverEvent, fromData } from 'battlestar-common'

const Game = {}

Game.create = async function(lobby, linkedDraftId) {
  async function _maybeHandleCubeDraft(game) {
    if (game.settings.game === 'Cube Draft' || game.settings.game === 'Set Draft') {

      // Create packs
      if (game.settings.game === 'Cube Draft') {
        const cube = await db.magic.cube.findById(game.settings.cubeId)
        const cards = await db.magic.card.findByIds(cube.cardlist)
        const wrappedCards = cards.map(c => new magic.MagicCard(c))
        game.settings.packs = magic.draft.pack.makeCubePacks(wrappedCards, {
          packSize: game.settings.packSize,
          numPacks: game.settings.numPacks,
          numPlayers: game.settings.players.length,
        })

        const numScars = game.settings.scarRounds.length * game.settings.players.length * 2
        if (numScars > cube.scarlist.length) {
          throw new Error('Insufficient scars for game')
        }
        if (numScars > 0) {
          game.settings.scars = util
            .array
            .shuffle([...cube.scarlist])
            .slice(0, numScars)
            .map(scar => scar.id)
        }
      }
      else if (game.settings.game === 'Set Draft') {
        const cards = await db.magic.card.findBySetCode(game.settings.set.code)
        const wrappedCards = cards.map(c => new magic.MagicCards(c))
        game.settings.packs = magic.draft.pack.makeSetPacks(wrappedCards, {
          numPacks: game.settings.numPacks,
          numPlayers: game.settings.players.length,
        })
        game.settings.packSize = game.settings.packs[0].length
      }
      else {
        throw new Error('Unknown game draft type: ' + game.settings.game)
      }

      // Create decks for each user.
      for (const player of game.settings.players) {
        const deck = await db.magic.deck.create(player, {
          name: game.settings.name,
          links: {
            draftId: game._id
          },
        })
        player.deckId = deck._id
      }

      // Save the draft settings afterwards so the deck ids and packs get saved.
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

    await _maybeHandleCubeDraft(game)
    await _maybeHandleMagicLinks(game, linkedDraftId)

    // Running the game makes sure the waiting information is correctly populated
    game.run()
    await db.game.save(game)

    // Save the game id in the lobby
    await db.lobby.gameLaunched(lobby, game)

    await notificationService.sendGameNotifications(game)

    return game
  }
  else {
    throw new Error('Error creating game')
  }
}

Game.insert = async function(data) {
  return await db.game.insert(data)
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

  game.log.setChat(chat)
  game.responses = responses

  // Magic doesn't run when saving because that would require loading the card
  // database, which is slow.
  if (game.settings.game === 'Magic'
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

export default Game

import { describe, it, expect, beforeEach, vi } from 'vitest'

const lobbyState = {
  _id: 'lobby-1',
  name: 'old-name',
  users: [],
  game: null,
  options: {},
}

vi.mock('../../../src/models/db.js', () => ({
  default: {
    lobby: {
      create: vi.fn().mockResolvedValue('lobby-1'),
      findById: vi.fn(async () => ({
        _id: lobbyState._id,
        name: lobbyState.name,
        users: [],
        game: null,
        options: {},
      })),
      save: vi.fn(async (lobby) => {
        Object.assign(lobbyState, {
          name: lobby.name,
          game: lobby.game,
          users: lobby.users,
          options: { ...lobby.options },
          seriesId: lobby.seriesId,
          seriesBaseName: lobby.seriesBaseName,
          seriesIndex: lobby.seriesIndex,
        })
      }),
    },
    game: {
      saveSettings: vi.fn().mockResolvedValue({}),
      linkGameToDraft: vi.fn(),
      linkDraftToGame: vi.fn(),
    },
    series: {
      reserveRematchIndex: vi.fn(),
      fetchForGame: vi.fn(),
      ensureAndAppendGame: vi.fn(),
      completeGameFor: vi.fn(),
    },
  },
}))

vi.mock('battlestar-common', () => ({
  magic: {},
  util: { array: { shuffle: (a) => a } },
  GameOverEvent: class GameOverEvent extends Error {},
  fromData: vi.fn(),
}))

vi.mock('../../../src/services/notification_service.js', () => ({
  default: { sendGameNotifications: vi.fn() },
}))

vi.mock('../../../src/middleware/loaders.js', () => ({
  GameKilledError: class GameKilledError extends Error {},
  GameOverwriteError: class GameOverwriteError extends Error {},
}))

import db from '../../../src/models/db.js'
import gameService from '../../../src/services/game_service.js'

describe('Game.rematch series naming', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    lobbyState.name = 'old-name'
    lobbyState.options = {}
    db.lobby.findById.mockImplementation(async () => ({
      _id: 'lobby-1',
      name: 'old-name',
      users: [],
      game: null,
      options: {},
    }))
  })

  it('names the first rematch with -2 and backfills series on the source game', async () => {
    db.series.reserveRematchIndex.mockResolvedValueOnce({
      seriesId: 'game-1',
      seriesBaseName: 'red-cherry',
      seriesIndex: 2,
    })

    const game = {
      _id: 'game-1',
      settings: {
        game: 'Innovation: Ultimate',
        name: 'red-cherry',
        players: [{ _id: 'u1', name: 'Alice' }, { _id: 'u2', name: 'Bob' }],
        expansions: ['base'],
        seed: 'red-cherry',
      },
    }

    const lobby = await gameService.rematch(game)

    expect(db.series.reserveRematchIndex).toHaveBeenCalledWith(game)
    expect(lobby.name).toBe('red-cherry-2')
    expect(lobby.seriesId).toBe('game-1')
    expect(lobby.seriesBaseName).toBe('red-cherry')
    expect(lobby.seriesIndex).toBe(2)
    expect(lobby.options.expansions).toEqual(['base'])
    expect(lobby.options.seed).toBeUndefined()
    expect(db.game.saveSettings).toHaveBeenCalledWith(game, expect.objectContaining({
      seriesId: 'game-1',
      seriesBaseName: 'red-cherry',
      seriesIndex: 1,
    }))
  })

  it('increments from an existing series index', async () => {
    db.series.reserveRematchIndex.mockResolvedValueOnce({
      seriesId: 'game-1',
      seriesBaseName: 'red-cherry',
      seriesIndex: 3,
    })

    const game = {
      _id: 'game-2',
      settings: {
        game: 'Agricola',
        name: 'red-cherry-2',
        players: [{ _id: 'u1', name: 'Alice' }],
        seriesId: 'game-1',
        seriesBaseName: 'red-cherry',
        seriesIndex: 2,
      },
    }

    const lobby = await gameService.rematch(game)

    expect(lobby.name).toBe('red-cherry-3')
    expect(lobby.seriesId).toBe('game-1')
    expect(lobby.seriesIndex).toBe(3)
    expect(db.game.saveSettings).not.toHaveBeenCalled()
  })

  it('uses linkedDraftId as seriesId for Magic games', async () => {
    db.series.reserveRematchIndex.mockResolvedValueOnce({
      seriesId: 'draft-1',
      seriesBaseName: 'spell-duel',
      seriesIndex: 2,
    })

    const game = {
      _id: 'magic-1',
      settings: {
        game: 'Magic',
        name: 'spell-duel',
        players: [{ _id: 'u1', name: 'Alice' }],
        linkedDraftId: 'draft-1',
      },
    }

    const lobby = await gameService.rematch(game)

    expect(lobby.name).toBe('spell-duel-2')
    expect(lobby.seriesId).toBe('draft-1')
    expect(lobby.options.linkedDraftId).toBe('draft-1')
    expect(db.game.saveSettings).toHaveBeenCalledWith(game, expect.objectContaining({
      seriesId: 'draft-1',
      seriesIndex: 1,
    }))
  })
})

describe('Game.fetchSeries', () => {
  it('delegates to the series model', async () => {
    const game = { _id: 'game-1', settings: {} }
    const result = { seriesId: 'game-1', root: null, games: [] }
    db.series.fetchForGame.mockResolvedValueOnce(result)

    await expect(gameService.fetchSeries(game)).resolves.toEqual(result)
    expect(db.series.fetchForGame).toHaveBeenCalledWith(game)
  })
})

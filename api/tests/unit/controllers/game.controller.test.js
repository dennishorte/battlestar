import { describe, it, expect, beforeEach, vi } from 'vitest'

// Import shared mocks
import passport from '../../mocks/passport.mock.js'
import * as passportJwt from '../../mocks/passport-jwt.mock.js'
import stats from '../../mocks/stats.mock.js'
import gameService from '../../mocks/game_service.mock.js'
import * as battlestarCommon from '../../mocks/battlestar-common.mock.js'
import logger from '../../mocks/logger.mock.js'
import db from '../../mocks/db.mock.js'

// Mock modules with our imported mocks
vi.mock('battlestar-common', () => {
  return battlestarCommon
})

vi.mock('passport', () => {
  return { default: passport }
})

vi.mock('passport-jwt', () => {
  return passportJwt
})

vi.mock('../../../src/models/db', () => {
  return { default: db }
})

vi.mock('../../../src/services/game_service', () => {
  return { default: gameService }
})

vi.mock('../../../src/utils/logger', () => {
  return { default: logger }
})

vi.mock('../../../src/utils/stats', () => {
  return { default: stats }
})

// Now we can import the controller
import * as gameController from '../../../src/controllers/game.controller.js'
import { NotFoundError } from '../../../src/utils/errors.js'

describe('Game Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      game: {
        serialize: vi.fn().mockReturnValue({ id: 'game-id', serialized: true })
      },
      lobby: { _id: 'lobby-id', name: 'Test Lobby' }
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()

    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new game and return the result', async () => {
      // Execute
      await gameController.create(req, res, next)

      // Verify
      expect(gameService.create).toHaveBeenCalledWith(req.lobby, req.body.linkedDraftId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        gameId: 'new-game-id'
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should pass errors to the next middleware', async () => {
      // Setup
      const error = new Error('Service error')
      gameService.create.mockRejectedValueOnce(error)

      // Execute
      await gameController.create(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('fetchAll', () => {
    it('should return all games', async () => {
      // Execute
      await gameController.fetchAll(req, res, next)

      // Verify
      expect(db.game.all).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        games: expect.arrayContaining([
          expect.objectContaining({ _id: 'game1' }),
          expect.objectContaining({ _id: 'game2' })
        ])
      })
    })

    it('should pass errors to the next middleware', async () => {
      // Setup
      const error = new Error('Database error')
      db.game.all.mockImplementationOnce(() => {
        throw error
      })

      // Execute
      await gameController.fetchAll(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('fetch', () => {
    it('should return the game if it exists in the request', async () => {
      // Execute
      await gameController.fetch(req, res, next)

      // Verify
      expect(req.game.serialize).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        game: { id: 'game-id', serialized: true }
      })
    })

    it('should return a NotFoundError if game is not in the request', async () => {
      // Setup
      req.game = null

      // Execute
      await gameController.fetch(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })

  describe('kill', () => {
    it('should kill a game and return success', async () => {
      // Execute
      await gameController.kill(req, res, next)

      // Verify
      expect(gameService.kill).toHaveBeenCalledWith(req.game)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return NotFoundError if game is not found', async () => {
      // Setup
      req.game = null

      // Execute
      await gameController.kill(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })

  describe('rematch', () => {
    it('should create a rematch and return success', async () => {
      // Execute
      await gameController.rematch(req, res, next)

      // Verify
      expect(gameService.rematch).toHaveBeenCalledWith(req.game)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        lobbyId: 'new-lobby-id'
      })
    })
  })

  describe('saveFull', () => {
    it('should save the full game and return the serialized game', async () => {
      // Setup
      req.body = {
        chat: [],
        responses: [],
        waiting: [],
        gameOver: false,
        gameOverData: {},
        branchId: 'branch-id',
        overwrite: false
      }

      // Execute
      await gameController.saveFull(req, res, next)

      // Verify
      expect(gameService.saveFull).toHaveBeenCalledWith(req.game, req.body)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        serializedGame: { id: 'game-id', state: 'updated' }
      })
    })
  })

  describe('saveResponse', () => {
    it('should save the game response and return the serialized game', async () => {
      // Setup
      req.body.response = { type: 'choice', value: 1 }

      // Execute
      await gameController.saveResponse(req, res, next)

      // Verify
      expect(gameService.saveResponse).toHaveBeenCalledWith(req.game, req.body.response)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        serializedGame: { id: 'game-id', state: 'response-saved' }
      })
    })
  })

  describe('undo', () => {
    it('should undo a game action and return the serialized game', async () => {
      // Setup
      req.body.count = 1

      // Execute
      await gameController.undo(req, res, next)

      // Verify
      expect(gameService.undo).toHaveBeenCalledWith(req.game, 1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        serializedGame: { id: 'game-id', state: 'undo-applied' }
      })
    })
  })

  describe('stats_innovation', () => {
    it('should return innovation stats', async () => {
      // Execute
      await gameController.stats_innovation(req, res, next)

      // Verify
      expect(stats.processInnovationStats).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { stats: 'test stats' }
      })
    })
  })
})

// Mock passport first, before requiring any other modules
jest.mock('passport', () => ({
  authenticate: jest.fn(() => (req, res, next) => next()),
  use: jest.fn()
}))

// Mock passport-jwt
jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn()
  }
}))

// Mock stats utility
jest.mock('../../../src/utils/stats', () => ({
  processInnovationStats: jest.fn().mockResolvedValue({ stats: 'test stats' })
}))

// Mock gameService
jest.mock('../../../src/services/game_service', () => ({
  create: jest.fn().mockResolvedValue({ _id: 'new-game-id' }),
  kill: jest.fn().mockResolvedValue({}),
  rematch: jest.fn().mockResolvedValue({ _id: 'new-lobby-id' }),
  saveFull: jest.fn().mockResolvedValue({ id: 'game-id', state: 'updated' }),
  saveResponse: jest.fn().mockResolvedValue({ id: 'game-id', state: 'response-saved' }),
  undo: jest.fn().mockResolvedValue({ id: 'game-id', state: 'undo-applied' })
}))

// Mock battlestar-common
jest.mock('battlestar-common', () => ({
  GameOverEvent: jest.fn(),
  fromData: jest.fn(data => data)
}))

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock db
jest.mock('../../../src/models/db', () => ({
  game: {
    all: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { _id: 'game1', name: 'Test Game 1' },
        { _id: 'game2', name: 'Test Game 2' }
      ])
    }),
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { _id: 'game1', name: 'Test Game 1' },
        { _id: 'game2', name: 'Test Game 2' }
      ])
    }),
    findById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    gameOver: jest.fn()
  }
}))

// Now we can import the controller
const gameController = require('../../../src/controllers/game.controller')
const { NotFoundError } = require('../../../src/utils/errors')
const gameService = require('../../../src/services/game_service')
const db = require('../../../src/models/db')
const logger = require('../../../src/utils/logger')

describe('Game Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      game: {
        serialize: jest.fn().mockReturnValue({ id: 'game-id', serialized: true })
      },
      lobby: { _id: 'lobby-id', name: 'Test Lobby' }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()

    jest.clearAllMocks()
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
        games: [
          { _id: 'game1', name: 'Test Game 1' },
          { _id: 'game2', name: 'Test Game 2' }
        ]
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

  describe('stats.innovation', () => {
    it('should return innovation stats', async () => {
      // Execute
      await gameController.stats.innovation(req, res, next)

      // Verify
      expect(db.game.find).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { stats: 'test stats' }
      })
    })
  })
})

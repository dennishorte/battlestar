const { loadGameArgs, loadLobbyArgs, loadDraftArgs, GameOverwriteError, GameKilledError } = require('../../../src/middleware/loaders')
const { NotFoundError } = require('../../../src/utils/errors')
const { ObjectId } = require('mongodb')

// Mock AsyncLock
jest.mock('async-lock', () => {
  return jest.fn().mockImplementation(() => {
    return {
      acquire: jest.fn((key, fn) => {
        return Promise.resolve(fn())
      })
    }
  })
})

// Mock db
jest.mock('../../../src/models/db', () => ({
  game: {
    findById: jest.fn()
  },
  lobby: {
    findById: jest.fn()
  }
}))

// Mock fromData from common
jest.mock('battlestar-common', () => ({
  fromData: jest.fn(data => data)
}))

const db = require('../../../src/models/db')
const { fromData } = require('battlestar-common')

describe('Data Loader Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {}
    }
    res = {
      locals: {},
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          // Simulate the callback being called
          callback()
        }
      })
    }
    next = jest.fn()
    
    jest.clearAllMocks()
  })

  describe('loadGameArgs', () => {
    it('should load game and set it on the request object', async () => {
      // Setup
      const gameId = new ObjectId()
      req.body.gameId = gameId
      const mockGame = { _id: gameId, name: 'Test Game' }
      db.game.findById.mockResolvedValue(mockGame)
      
      // Execute
      await loadGameArgs(req, res, next)
      
      // Verify
      expect(db.game.findById).toHaveBeenCalledWith(gameId)
      expect(fromData).toHaveBeenCalledWith(mockGame)
      expect(req.game).toEqual(mockGame)
      expect(next).toHaveBeenCalled()
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    })

    it('should call next with NotFoundError if game is not found', async () => {
      // Setup
      const gameId = new ObjectId()
      req.body.gameId = gameId
      db.game.findById.mockResolvedValue(null)
      
      // Execute
      await loadGameArgs(req, res, next)
      
      // Verify
      expect(db.game.findById).toHaveBeenCalledWith(gameId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain(gameId.toString())
    })

    it('should just call next if no gameId is provided', async () => {
      // Setup
      req.body.gameId = null
      
      // Execute
      await loadGameArgs(req, res, next)
      
      // Verify
      expect(db.game.findById).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0]).toBeUndefined()
    })
  })

  describe('loadLobbyArgs', () => {
    it('should load lobby and set it on the request object', async () => {
      // Setup
      const lobbyId = new ObjectId()
      req.body.lobbyId = lobbyId
      const mockLobby = { _id: lobbyId, name: 'Test Lobby' }
      db.lobby.findById.mockResolvedValue(mockLobby)
      
      // Execute
      await loadLobbyArgs(req, res, next)
      
      // Verify
      expect(db.lobby.findById).toHaveBeenCalledWith(lobbyId)
      expect(req.lobby).toEqual(mockLobby)
      expect(next).toHaveBeenCalled()
    })

    it('should call next with NotFoundError if lobby is not found', async () => {
      // Setup
      const lobbyId = new ObjectId()
      req.body.lobbyId = lobbyId
      db.lobby.findById.mockResolvedValue(null)
      
      // Execute
      await loadLobbyArgs(req, res, next)
      
      // Verify
      expect(db.lobby.findById).toHaveBeenCalledWith(lobbyId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain('lobby not found')
    })
  })

  describe('loadDraftArgs', () => {
    it('should load draft (which is a game) and set it on the request object', async () => {
      // Setup
      const draftId = new ObjectId()
      req.body.draftId = draftId
      const mockDraft = { _id: draftId, name: 'Test Draft' }
      db.game.findById.mockResolvedValue(mockDraft)
      
      // Execute
      await loadDraftArgs(req, res, next)
      
      // Verify
      expect(db.game.findById).toHaveBeenCalledWith(draftId)
      expect(fromData).toHaveBeenCalledWith(mockDraft)
      expect(req.draft).toEqual(mockDraft)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('Error classes', () => {
    it('GameOverwriteError should have correct properties', () => {
      const error = new GameOverwriteError('Test message')
      expect(error.name).toBe('GameOverwriteError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('game_overwrite')
      expect(error.statusCode).toBe(409)
    })

    it('GameOverwriteError should use default message if none provided', () => {
      const error = new GameOverwriteError()
      expect(error.message).toBe('game overwrite')
    })

    it('GameKilledError should have correct properties', () => {
      const error = new GameKilledError('Test message')
      expect(error.name).toBe('GameKilledError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('game_killed')
      expect(error.statusCode).toBe(409)
    })

    it('GameKilledError should use default message if none provided', () => {
      const error = new GameKilledError()
      expect(error.message).toBe('game killed')
    })
  })
}) 

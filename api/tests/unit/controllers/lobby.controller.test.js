// Mock MongoDB ObjectId
jest.mock('mongodb', () => ({
  ObjectId: jest.fn().mockImplementation(id => ({
    equals: jest.fn(otherId => id === otherId),
    toString: jest.fn(() => id)
  }))
}))

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock db
jest.mock('../../../src/models/db', () => ({
  lobby: {
    all: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { _id: 'lobby1', name: 'Lobby One', users: [] },
        { _id: 'lobby2', name: 'Lobby Two', users: [] }
      ])
    }),
    create: jest.fn().mockResolvedValue('new-lobby-id'),
    findById: jest.fn().mockResolvedValue({
      _id: 'new-lobby-id',
      users: []
    }),
    save: jest.fn().mockResolvedValue(true),
    kill: jest.fn().mockResolvedValue(true)
  },
  user: {
    findByIds: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { _id: 'user1', name: 'User One' },
        { _id: 'user2', name: 'User Two' }
      ])
    })
  }
}))

// Import after mocks are set up
const lobbyController = require('../../../src/controllers/lobby.controller')
const { BadRequestError, NotFoundError } = require('../../../src/utils/errors')
const db = require('../../../src/models/db')
const logger = require('../../../src/utils/logger')
const { ObjectId } = require('mongodb')

describe('Lobby Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { _id: 'user1', name: 'User One' }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getAllLobbies', () => {
    it('should return all lobbies', async () => {
      // Execute
      await lobbyController.getAllLobbies(req, res, next)

      // Verify
      expect(db.lobby.all).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        lobbies: expect.arrayContaining([
          expect.objectContaining({ _id: 'lobby1' }),
          expect.objectContaining({ _id: 'lobby2' })
        ])
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      const error = new Error('Database error')
      db.lobby.all.mockImplementationOnce(() => {
        throw error
      })

      // Execute
      await lobbyController.getAllLobbies(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createLobby', () => {
    it('should create a new lobby with default user', async () => {
      // Execute
      await lobbyController.createLobby(req, res, next)

      // Verify
      expect(db.lobby.create).toHaveBeenCalled()
      expect(db.lobby.findById).toHaveBeenCalledWith('new-lobby-id')
      expect(db.user.findByIds).toHaveBeenCalled()
      expect(db.lobby.save).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        lobbyId: 'new-lobby-id'
      })
    })

    it('should create a lobby with specified users, game, and options', async () => {
      // Setup
      req.body = {
        userIds: ['user1', 'user2'],
        game: 'innovation',
        options: { option1: 'value1' }
      }

      // Execute
      await lobbyController.createLobby(req, res, next)

      // Verify
      expect(ObjectId).toHaveBeenCalledTimes(2)
      expect(db.user.findByIds).toHaveBeenCalled()
      expect(db.lobby.save).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'new-lobby-id',
        game: 'innovation',
        options: { option1: 'value1' }
      }))
    })

    it('should return BadRequestError if user is not provided', async () => {
      // Setup
      req.user = null

      // Execute
      await lobbyController.createLobby(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.lobby.create).not.toHaveBeenCalled()
    })

    it('should handle errors for invalid user IDs', async () => {
      // Setup
      req.body = { userIds: ['invalid-id'] }
      ObjectId.mockImplementationOnce(() => {
        throw new Error('Invalid ID format')
      })

      // Execute
      await lobbyController.createLobby(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('getLobbyInfo', () => {
    it('should return lobby information', async () => {
      // Setup
      req.lobby = { _id: 'lobby1', name: 'Test Lobby', users: [] }

      // Execute
      await lobbyController.getLobbyInfo(req, res, next)

      // Verify
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        lobby: expect.objectContaining({ _id: 'lobby1' })
      })
    })

    it('should return NotFoundError if lobby is not found', async () => {
      // Setup
      req.lobby = null
      req.body = { lobbyId: 'nonexistent' }

      // Execute
      await lobbyController.getLobbyInfo(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })

  describe('killLobby', () => {
    it('should kill a lobby', async () => {
      // Setup
      req.lobby = { _id: 'lobby1', name: 'Test Lobby' }

      // Execute
      await lobbyController.killLobby(req, res, next)

      // Verify
      expect(db.lobby.kill).toHaveBeenCalledWith(req.lobby)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return NotFoundError if lobby is not found', async () => {
      // Setup
      req.lobby = null

      // Execute
      await lobbyController.killLobby(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(db.lobby.kill).not.toHaveBeenCalled()
    })
  })

  describe('saveLobby', () => {
    it('should save lobby changes', async () => {
      // Setup
      req.body = { _id: 'lobby1', name: 'Updated Lobby', users: [] }

      // Execute
      await lobbyController.saveLobby(req, res, next)

      // Verify
      expect(db.lobby.save).toHaveBeenCalledWith(req.body)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if lobby data is invalid', async () => {
      // Setup
      req.body = {} // Missing _id

      // Execute
      await lobbyController.saveLobby(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.lobby.save).not.toHaveBeenCalled()
    })
  })
})

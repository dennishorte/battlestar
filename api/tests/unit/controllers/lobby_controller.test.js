import { describe, it, expect, beforeEach, vi } from 'vitest'

// Import shared mocks
import logger from '../../mocks/logger.mock.js'
import db from '../../mocks/db.mock.js'

// Mock MongoDB ObjectId
vi.mock('mongodb', () => {
  return {
    ObjectId: vi.fn().mockImplementation(id => ({
      equals: vi.fn(otherId => id === otherId),
      toString: vi.fn(() => id)
    }))
  }
})

vi.mock('../../../src/utils/logger', () => {
  return { default: logger }
})

vi.mock('../../../src/models/db', () => {
  return { default: db }
})

// Import after mocks are set up
import * as lobbyController from '../../../src/controllers/lobby_controller.js'
import { BadRequestError, NotFoundError } from '../../../src/utils/errors.js'
import { ObjectId } from 'mongodb'

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
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()

    vi.clearAllMocks()
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

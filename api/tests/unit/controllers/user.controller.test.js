import { describe, it, expect, beforeEach, vi } from 'vitest'

// Import shared mocks
import passport from '../../mocks/passport.mock.js'
import * as passportJwt from '../../mocks/passport-jwt.mock.js'
import logger from '../../mocks/logger.mock.js'
import db from '../../mocks/db.mock.js'

// Mock passport
vi.mock('passport', () => {
  return { default: passport }
})

// Mock passport-jwt
vi.mock('passport-jwt', () => {
  return passportJwt
})

// Mock logger
vi.mock('../../../src/utils/logger', () => {
  return { default: logger }
})

// Mock db
vi.mock('../../../src/models/db', () => {
  return { default: db }
})

// Mock MongoDB's ObjectId
vi.mock('mongodb', () => {
  return {
    ObjectId: vi.fn().mockImplementation(id => ({
      equals: vi.fn(otherId => id === otherId),
      toString: vi.fn(() => id)
    }))
  }
})

// Now we can import the controller and errors
import * as userController from '../../../src/controllers/user.controller.js'
import { BadRequestError } from '../../../src/utils/errors.js'
import { ObjectId } from 'mongodb'

describe('User Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()

    vi.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Execute
      await userController.getAllUsers(req, res, next)

      // Verify
      expect(db.user.all).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        users: expect.any(Array)
      })
    })

    it('should pass errors to the next middleware', async () => {
      // Setup
      const error = new Error('Database error')
      db.user.all.mockRejectedValueOnce(error)

      // Execute
      await userController.getAllUsers(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createUser', () => {
    it('should create a new user and return success', async () => {
      // Setup
      req.body = {
        name: 'New User',
        password: 'password123',
        slack: 'newuser'
      }

      // Execute
      await userController.createUser(req, res, next)

      // Verify
      expect(db.user.create).toHaveBeenCalledWith({
        name: 'New User',
        password: 'password123',
        slack: 'newuser'
      })
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User created'
      })
    })

    it('should return BadRequestError if name or password is missing', async () => {
      // Setup
      req.body = { name: 'New User' } // Missing password

      // Execute
      await userController.createUser(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.user.create).not.toHaveBeenCalled()
    })

    it('should handle database errors during creation', async () => {
      // Setup
      req.body = {
        name: 'New User',
        password: 'password123'
      }
      db.user.create.mockRejectedValueOnce(new Error('Duplicate key'))

      // Execute
      await userController.createUser(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('deactivateUser', () => {
    it('should deactivate a user and return success', async () => {
      // Setup
      req.body = { id: 'user1' }

      // Execute
      await userController.deactivateUser(req, res, next)

      // Verify
      expect(db.user.deactivate).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if id is missing', async () => {
      // Setup
      req.body = {} // Missing id

      // Execute
      await userController.deactivateUser(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.user.deactivate).not.toHaveBeenCalled()
    })

    it('should handle non-successful deactivation', async () => {
      // Setup
      req.body = { id: 'nonexistent-user' }
      db.user.deactivate.mockResolvedValueOnce({ modifiedCount: 0 })

      // Execute
      await userController.deactivateUser(req, res, next)

      // Verify
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not deactivated'
      })
    })
  })

  describe('fetchManyUsers', () => {
    it('should fetch multiple users by IDs', async () => {
      // Setup
      req.body = { userIds: ['user1', 'user2'] }

      // Execute
      await userController.fetchManyUsers(req, res, next)

      // Verify
      expect(ObjectId).toHaveBeenCalledTimes(2)
      expect(db.user.findByIds).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        users: expect.any(Array)
      })
    })

    it('should return BadRequestError if userIds is not an array', async () => {
      // Setup
      req.body = { userIds: 'user1' } // Not an array

      // Execute
      await userController.fetchManyUsers(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('getUserLobbies', () => {
    it('should fetch lobbies for a user', async () => {
      // Setup
      req.body = { userId: 'user1' }

      // Execute
      await userController.getUserLobbies(req, res, next)

      // Verify
      expect(ObjectId).toHaveBeenCalled()
      expect(db.lobby.findByUserId).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        lobbies: expect.any(Array)
      })
    })

    it('should return BadRequestError if userId is missing', async () => {
      // Setup
      req.body = {} // Missing userId

      // Execute
      await userController.getUserLobbies(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should handle errors for invalid userId format', async () => {
      // Setup
      req.body = { userId: 'invalid-id' }
      ObjectId.mockImplementationOnce(() => {
        throw new Error('Invalid ID format')
      })

      // Execute
      await userController.getUserLobbies(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('getUserGames', () => {
    it('should fetch games for a user', async () => {
      // Setup
      req.body = {
        userId: 'user1',
        state: 'all',
        kind: 'innovation'
      }

      // Execute
      await userController.getUserGames(req, res, next)

      // Verify
      expect(ObjectId).toHaveBeenCalled()
      expect(db.game.find).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        games: expect.any(Array)
      })
    })

    it('should handle errors for invalid userId format', async () => {
      // Setup
      req.body = { userId: 'invalid-id' }
      ObjectId.mockImplementationOnce(() => {
        throw new Error('Invalid ID format')
      })

      // Execute
      await userController.getUserGames(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('getRecentlyFinishedGames', () => {
    it('should fetch recently finished games for a user', async () => {
      // Setup
      req.body = { userId: 'user1' }

      // Execute
      await userController.getRecentlyFinishedGames(req, res, next)

      // Verify
      expect(ObjectId).toHaveBeenCalled()
      expect(db.game.findRecentlyFinishedByUserId).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        games: expect.any(Array)
      })
    })

    it('should return BadRequestError if userId is missing', async () => {
      // Setup
      req.body = {} // Missing userId

      // Execute
      await userController.getRecentlyFinishedGames(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })
})

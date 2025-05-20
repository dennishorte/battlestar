import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as deckController from '../../../../src/controllers/magic/deck.controller.js'
import { ObjectId } from 'mongodb'

// Mock dependencies
vi.mock('../../../../src/models/db', () => {
  return {
    default: {
      magic: {
        deck: {
          findById: vi.fn(),
          findAll: vi.fn(),
          create: vi.fn(),
          update: vi.fn(),
          delete: vi.fn()
        }
      }
    }
  }
})

import db from '../../../../src/models/db.js'

describe('Deck Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: new ObjectId('507f1f77bcf86cd799439011') }
    }
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new deck and return success response', async () => {
      // Setup
      const mockDeckData = { name: 'New Deck', cards: [] }
      const mockCreatedDeck = {
        _id: new ObjectId('507f1f77bcf86cd799439013'),
        ...mockDeckData,
        userId: req.user._id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }

      req.body.opts = mockDeckData
      db.magic.deck.create.mockResolvedValueOnce(mockCreatedDeck)

      // Execute
      await deckController.create(req, res)

      // Verify
      expect(db.magic.deck.create).toHaveBeenCalledWith(req.user, mockDeckData)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockCreatedDeck
      })
    })

    it('should handle errors during deck creation', async () => {
      // Setup
      req.body.opts = { name: 'New Deck', cards: [] }

      // Mock console.error to prevent log output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const errorMessage = 'Failed to create deck'
      db.magic.deck.create.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await deckController.create(req, res)

      // Verify
      expect(db.magic.deck.create).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('findAll', () => {
    it('should find all decks for the current user', async () => {
      // Setup
      const mockDecks = [
        { _id: new ObjectId(), name: 'Deck 1', userId: req.user._id },
        { _id: new ObjectId(), name: 'Deck 2', userId: req.user._id }
      ]

      db.magic.deck.findAll.mockResolvedValueOnce(mockDecks)

      // Execute
      await deckController.findAll(req, res)

      // Verify
      expect(db.magic.deck.findAll).toHaveBeenCalledWith(req.user)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        decks: mockDecks
      })
    })

    it('should handle errors when finding decks', async () => {
      // Setup
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorMessage = 'Failed to find decks'
      db.magic.deck.findAll.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await deckController.findAll(req, res)

      // Verify
      expect(db.magic.deck.findAll).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('update', () => {
    it('should update a deck and return success response', async () => {
      // Setup
      const deckId = new ObjectId('507f1f77bcf86cd799439013')
      const mockDeckData = { name: 'Updated Deck', cards: [] }
      const mockUpdatedDeck = {
        _id: deckId,
        ...mockDeckData,
        userId: req.user._id,
        updatedAt: expect.any(Date)
      }

      req.body.deckId = deckId
      req.body.deckData = mockDeckData
      db.magic.deck.update.mockResolvedValueOnce(mockUpdatedDeck)

      // Execute
      await deckController.update(req, res)

      // Verify
      expect(db.magic.deck.update).toHaveBeenCalledWith(deckId, mockDeckData, req.user)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockUpdatedDeck
      })
    })

    it('should return error when required fields are missing', async () => {
      // Execute
      await deckController.update(req, res)

      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required fields: deckId and deckData'
      })
    })

    it('should handle errors during deck update', async () => {
      // Setup
      const deckId = new ObjectId('507f1f77bcf86cd799439013')
      req.body.deckId = deckId
      req.body.deckData = { name: 'Updated Deck', cards: [] }

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorMessage = 'Failed to update deck'
      db.magic.deck.update.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await deckController.update(req, res)

      // Verify
      expect(db.magic.deck.update).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })
})

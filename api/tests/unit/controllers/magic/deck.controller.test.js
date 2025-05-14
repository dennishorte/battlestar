const deckController = require('../../../../src/controllers/magic/deck.controller.js')
const { ObjectId } = require('mongodb')

// Mock deck models
jest.mock('../../../../src/models/magic/deck_models', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  duplicate: jest.fn(),
  save: jest.fn(),
  findByUserId: jest.fn()
}))

// Mock db to use the deck models
jest.mock('../../../../src/models/db', () => ({
  magic: {
    deck: require('../../../../src/models/magic/deck_models.js')
  }
}))

const deckModels = require('../../../../src/models/magic/deck_models.js')

describe('Deck Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: 'user-id-123' },
      deck: null
    }
    res = {
      json: jest.fn()
    }
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new deck and return success response with the deck', async () => {
      // Setup
      const mockDeckId = new ObjectId('507f1f77bcf86cd799439011')
      const mockDeck = {
        _id: mockDeckId,
        name: 'New Deck',
        cardIdsByZone: {
          main: [],
          side: [],
          command: []
        }
      }

      deckModels.create.mockResolvedValueOnce(mockDeck)

      // Execute
      await deckController.create(req, res)

      // Verify
      expect(deckModels.create).toHaveBeenCalledWith(req.user)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockDeck
      })
    })
  })

  describe('duplicate', () => {
    it('should duplicate a deck and return the new deck', async () => {
      // Setup
      const originalDeck = { _id: 'original-deck-id', name: 'Original Deck' }
      const newDeck = { _id: 'new-deck-id', name: 'Original Deck' }

      req.deck = originalDeck
      req.user = { _id: 'user-id' }

      deckModels.duplicate.mockResolvedValueOnce(newDeck)

      // Execute
      await deckController.duplicate(req, res)

      // Verify
      expect(deckModels.duplicate).toHaveBeenCalledWith(req.user, req.deck)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: newDeck
      })
    })
  })

  describe('fetch', () => {
    it('should return the deck loaded by the data loader', async () => {
      // Setup
      const mockDeckId = new ObjectId('507f1f77bcf86cd799439011')
      const mockDeck = {
        _id: mockDeckId,
        name: 'Test Deck',
        cardIdsByZone: {
          main: [],
          side: [],
          command: []
        }
      }

      // Set the deck directly on the request as the data loader would
      req.deck = mockDeck

      // Execute
      await deckController.fetch(req, res)

      // Verify - no longer calling findById directly
      expect(deckModels.findById).not.toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockDeck
      })
    })
  })

  describe('save', () => {
    it('should save changes to a deck and return success response', async () => {
      // Setup
      const mockDeck = {
        _id: new ObjectId('507f1f77bcf86cd799439011'),
        name: 'Updated Deck',
        cardIdsByZone: {
          main: [],
          side: [],
          command: []
        }
      }
      req.body.deck = mockDeck

      deckModels.save.mockResolvedValueOnce({ value: mockDeck })

      // Execute
      await deckController.save(req, res)

      // Verify
      expect(deckModels.save).toHaveBeenCalledWith(mockDeck)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })
  })
})

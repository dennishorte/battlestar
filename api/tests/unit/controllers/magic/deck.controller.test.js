const deckController = require('../../../../src/controllers/magic/deck.controller')
const { ObjectId } = require('mongodb')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  magic: {
    deck: {
      create: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      addCard: jest.fn()
    }
  }
}))

const db = require('../../../../src/models/db')

describe('Deck Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {}
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
      const mockDeck = { _id: mockDeckId, name: 'Test Deck', cards: [] }
      req.body = { name: 'Test Deck', userId: new ObjectId('507f1f77bcf86cd799439012') }
      
      db.magic.deck.create.mockResolvedValueOnce(mockDeckId)
      db.magic.deck.findById.mockResolvedValueOnce(mockDeck)
      
      // Execute
      await deckController.create(req, res)
      
      // Verify
      expect(db.magic.deck.create).toHaveBeenCalledWith(req.body)
      expect(db.magic.deck.findById).toHaveBeenCalledWith(mockDeckId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockDeck
      })
    })
  })

  describe('fetch', () => {
    it('should return the deck loaded by the data loader', async () => {
      // Setup
      const mockDeckId = new ObjectId('507f1f77bcf86cd799439011')
      const mockDeck = { _id: mockDeckId, name: 'Test Deck', cards: [] }
      
      // Set the deck directly on the request as the data loader would
      req.deck = mockDeck
      
      // Execute
      await deckController.fetch(req, res)
      
      // Verify - no longer calling findById directly
      expect(db.magic.deck.findById).not.toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockDeck
      })
    })
  })

  describe('save', () => {
    it('should save changes to a deck and return success response', async () => {
      // Setup
      const mockDeck = { _id: new ObjectId('507f1f77bcf86cd799439011'), name: 'Updated Deck', cards: [] }
      req.body.deck = mockDeck
      
      db.magic.deck.save.mockResolvedValueOnce()
      
      // Execute
      await deckController.save(req, res)
      
      // Verify
      expect(db.magic.deck.save).toHaveBeenCalledWith(mockDeck)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })
  })

  describe('addCard', () => {
    it('should add a card to a deck and return success response', async () => {
      // Setup - data loader would populate req.deck and req.card
      const mockDeckId = new ObjectId('507f1f77bcf86cd799439011')
      const mockCardId = new ObjectId('507f1f77bcf86cd799439022')
      const mockDeck = { _id: mockDeckId, name: 'Test Deck', cards: [] }
      const mockCard = { _id: mockCardId, name: 'Test Card' }
      
      // Set objects directly on request as the data loader would
      req.deck = mockDeck
      req.card = mockCard
      
      db.magic.deck.addCard.mockResolvedValueOnce()
      
      // Execute
      await deckController.addCard(req, res)
      
      // Verify - passing objects, not IDs
      expect(db.magic.deck.addCard).toHaveBeenCalledWith(mockDeck, mockCard)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should fail if deck or card is not loaded', async () => {
      // Setup - missing req.deck and req.card
      res.status = jest.fn().mockReturnThis()
      
      // Execute
      await deckController.addCard(req, res)
      
      // Verify - should not call addCard if objects not present
      expect(db.magic.deck.addCard).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required resources: deck and card must be loaded'
      })
    })
  })
}) 

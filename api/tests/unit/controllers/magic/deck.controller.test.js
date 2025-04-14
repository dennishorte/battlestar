const deckController = require('../../../../src/controllers/magic/deck.controller')

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
      const mockDeckId = '507f1f77bcf86cd799439011'
      const mockDeck = { _id: mockDeckId, name: 'Test Deck', cards: [] }
      req.body = { name: 'Test Deck', userId: '507f1f77bcf86cd799439012' }
      
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
    it('should fetch a deck by ID and return success response with the deck', async () => {
      // Setup
      const mockDeckId = '507f1f77bcf86cd799439011'
      const mockDeck = { _id: mockDeckId, name: 'Test Deck', cards: [] }
      req.body.deckId = mockDeckId
      
      db.magic.deck.findById.mockResolvedValueOnce(mockDeck)
      
      // Execute
      await deckController.fetch(req, res)
      
      // Verify
      expect(db.magic.deck.findById).toHaveBeenCalledWith(mockDeckId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        deck: mockDeck
      })
    })
  })

  describe('save', () => {
    it('should save changes to a deck and return success response', async () => {
      // Setup
      const mockDeck = { _id: '507f1f77bcf86cd799439011', name: 'Updated Deck', cards: [] }
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
      // Setup
      const mockDeckId = '507f1f77bcf86cd799439011'
      const mockCard = { _id: '507f1f77bcf86cd799439022', name: 'Test Card' }
      req.body.deckId = mockDeckId
      req.body.card = mockCard
      
      db.magic.deck.addCard.mockResolvedValueOnce()
      
      // Execute
      await deckController.addCard(req, res)
      
      // Verify
      expect(db.magic.deck.addCard).toHaveBeenCalledWith(mockDeckId, mockCard)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })
  })
}) 
const cardController = require('../../../../src/controllers/magic/card.controller')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  magic: {
    card: {
      fetchAll: jest.fn(),
      insertCustom: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      versions: jest.fn()
    }
  }
}))

const db = require('../../../../src/models/db')

describe('Card Controller', () => {
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

  describe('fetchAll', () => {
    it('should fetch all cards and return success response', async () => {
      // Setup
      const mockCardData = { cards: [{ name: 'Test Card' }], count: 1 }
      db.magic.card.fetchAll.mockResolvedValueOnce(mockCardData)
      req.body.source = 'test-source'
      
      // Execute
      await cardController.fetchAll(req, res)
      
      // Verify
      expect(db.magic.card.fetchAll).toHaveBeenCalledWith('test-source')
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        ...mockCardData
      })
    })
  })

  describe('save', () => {
    it('should create a new card and return success response', async () => {
      // Setup
      const mockCard = { name: 'New Card', type: 'Creature' }
      req.body.card = mockCard
      req.body.editor = 'Test User'
      req.body.comment = 'Test comment'
      
      const mockInsertedId = '507f1f77bcf86cd799439011'
      const mockFinalizedCard = { _id: mockInsertedId, ...mockCard }
      
      db.magic.card.save.mockResolvedValueOnce(mockInsertedId)
      db.magic.card.findById.mockResolvedValueOnce(mockFinalizedCard)
      
      // Execute
      await cardController.save(req, res)
      
      // Verify
      expect(db.magic.card.save).toHaveBeenCalled()
      expect(db.magic.card.findById).toHaveBeenCalledWith(mockInsertedId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cardCreated: true,
        cardReplaced: false,
        finalizedCard: mockFinalizedCard
      })
    })

    it('should update an existing card by id and return success response', async () => {
      // Setup
      const mockCardId = '507f1f77bcf86cd799439011'
      const mockCard = { _id: mockCardId, name: 'Existing Card', type: 'Creature' }
      const mockUpdatedCard = { name: 'Updated Card', type: 'Creature' }
      
      req.body.card = mockCard
      req.body.editor = 'Test User'
      req.body.comment = 'Update comment'
      
      db.magic.card.findById.mockResolvedValueOnce(mockCard)
      db.magic.card.save.mockResolvedValueOnce(mockCardId)
      db.magic.card.findById.mockResolvedValueOnce({ ...mockCard, ...mockUpdatedCard })
      
      // Execute
      await cardController.save(req, res)
      
      // Verify
      expect(db.magic.card.findById).toHaveBeenCalledWith(mockCardId)
      expect(db.magic.card.save).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cardCreated: false,
        cardReplaced: true,
        finalizedCard: expect.objectContaining({ _id: mockCardId })
      })
    })

    it('should handle creating a custom card from a Scryfall card', async () => {
      // Setup
      const mockOriginal = { id: 'scryfall-id', name: 'Scryfall Card' }
      const mockCustomCard = { _id: '507f1f77bcf86cd799439011', ...mockOriginal, custom_id: 'custom-1' }
      const mockFinalCard = { ...mockCustomCard, name: 'Custom Card' }
      
      req.body.original = mockOriginal
      req.body.card = { name: 'Custom Card' }
      req.body.editor = 'Test User'
      
      db.magic.card.insertCustom.mockResolvedValueOnce(mockCustomCard)
      db.magic.card.save.mockResolvedValueOnce(mockCustomCard._id)
      db.magic.card.findById.mockResolvedValueOnce(mockFinalCard)
      
      // Execute
      await cardController.save(req, res)
      
      // Verify
      expect(db.magic.card.insertCustom).toHaveBeenCalledWith(mockOriginal)
      expect(db.magic.card.save).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cardCreated: false,
        cardReplaced: true,
        finalizedCard: mockFinalCard
      })
    })
  })
  
  describe('versions', () => {
    it('should fetch card versions and return success response', async () => {
      // Setup
      const mockVersions = [{ version: '1.0', count: 100 }]
      db.magic.card.versions.mockResolvedValueOnce(mockVersions)
      
      // Execute
      await cardController.versions(req, res)
      
      // Verify
      expect(db.magic.card.versions).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        versions: mockVersions
      })
    })
  })
}) 

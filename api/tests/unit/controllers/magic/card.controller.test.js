const cardController = require('../../../../src/controllers/magic/card.controller')
const { ObjectId } = require('mongodb')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  magic: {
    card: {
      fetchAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      versions: jest.fn()
    },
    cube: {
      findById: jest.fn()
    }
  }
}))

const db = require('../../../../src/models/db')

describe('Card Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: new ObjectId('507f1f77bcf86cd799439011') },
      // The cube would be loaded by data-loader middleware based on cubeId
      cube: { _id: new ObjectId('507f1f77bcf86cd799439012'), name: 'Test Cube' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
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

  describe('create', () => {
    it('should create a new card and return success response', async () => {
      // Setup
      const mockCardData = { name: 'New Card', type: 'Creature' }
      const mockCreatedCard = { 
        _id: new ObjectId('507f1f77bcf86cd799439013'),
        data: mockCardData,
        cubeId: req.cube._id,
        edits: [{ 
          userId: req.user._id,
          comment: 'Test comment',
          date: expect.any(Date),
          oldData: null
        }]
      }
      
      // Set both cardData and cubeId as they're both required for validation
      req.body.cardData = mockCardData
      req.body.cubeId = req.cube._id // This is what triggers data-loader to set req.cube
      req.body.comment = 'Test comment'
      
      db.magic.card.create.mockResolvedValueOnce(mockCreatedCard)
      
      // Execute
      await cardController.create(req, res)
      
      // Verify
      expect(db.magic.card.create).toHaveBeenCalledWith(
        mockCardData,
        req.cube,
        req.user,
        'Test comment'
      )
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        card: mockCreatedCard
      })
    })

    it('should return error when cube is not found', async () => {
      // Setup
      req.cube = null // dataloader would not set req.cube if cube not found
      req.body.cardData = { name: 'New Card' }
      req.body.cubeId = new ObjectId('507f1f77bcf86cd799439012') // Still need cubeId in body for validation
      
      // Execute
      await cardController.create(req, res)
      
      // Verify
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Cube not found'
      })
    })

    it('should return error when required fields are missing', async () => {
      // Setup
      req.body = { comment: 'Test comment' }
      // cubeId is missing which would cause validation failure
      
      // Execute
      await cardController.create(req, res)
      
      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required fields: cardData and cubeId are required'
      })
    })
  })

  describe('update', () => {
    it('should update an existing card and return success response', async () => {
      // Setup
      const cardId = new ObjectId('507f1f77bcf86cd799439013')
      const mockCardData = { name: 'Updated Card', type: 'Creature' }
      const mockUpdatedCard = { 
        _id: cardId,
        data: mockCardData,
        cubeId: req.cube._id,
        edits: [
          { 
            userId: req.user._id,
            comment: 'Update comment',
            date: expect.any(Date),
            oldData: { name: 'Old Card', type: 'Creature' }
          }
        ]
      }
      
      req.body.cardId = cardId
      req.body.cardData = mockCardData
      req.body.comment = 'Update comment'
      
      db.magic.card.update.mockResolvedValueOnce(mockUpdatedCard)
      
      // Execute
      await cardController.update(req, res)
      
      // Verify
      expect(db.magic.card.update).toHaveBeenCalledWith(
        cardId,
        mockCardData,
        req.user,
        'Update comment'
      )
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        card: mockUpdatedCard
      })
    })

    it('should return error when card is not found', async () => {
      // Setup
      req.body.cardId = new ObjectId('507f1f77bcf86cd799439013')
      req.body.cardData = { name: 'Updated Card' }
      
      db.magic.card.update.mockResolvedValueOnce(null)
      
      // Execute
      await cardController.update(req, res)
      
      // Verify
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Card not found or update failed'
      })
    })

    it('should return error when required fields are missing', async () => {
      // Setup
      req.body = { comment: 'Update comment' }
      
      // Execute
      await cardController.update(req, res)
      
      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required fields: cardId and cardData are required'
      })
    })
  })
  
  describe('versions', () => {
    it('should fetch card versions and return success response', async () => {
      // Setup
      const mockVersions = { custom: 1, scryfall: 2 }
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

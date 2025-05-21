import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as cardController from '../../../../src/controllers/magic/card.controller.js'
import { ObjectId } from 'mongodb'
import { magic } from 'battlestar-common'

// Mock dependencies
vi.mock('../../../../src/models/db', () => {
  return {
    default: {
      magic: {
        card: {
          fetchAll: vi.fn(),
          create: vi.fn(),
          update: vi.fn(),
          findById: vi.fn(),
          versions: vi.fn()
        },
        cube: {
          findById: vi.fn(),
          addCard: vi.fn(),
          updateScarlist: vi.fn()
        }
      }
    }
  }
})

import db from '../../../../src/models/db.js'

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
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    vi.clearAllMocks()
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
          action: 'create',
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
      db.magic.cube.addCard.mockResolvedValueOnce({ success: true })

      // Execute
      await cardController.create(req, res)

      // Verify
      expect(db.magic.card.create).toHaveBeenCalledWith(
        mockCardData,
        req.cube,
        req.user,
        'Test comment'
      )
      expect(db.magic.cube.addCard).toHaveBeenCalledWith(req.cube, mockCreatedCard)
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

    it('should handle errors from cube.addCard', async () => {
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

      req.body.cardData = mockCardData
      req.body.cubeId = req.cube._id
      req.body.comment = 'Test comment'

      // Mock console.error to prevent log output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const errorMessage = 'Failed to add card to cube'
      db.magic.card.create.mockResolvedValueOnce(mockCreatedCard)
      db.magic.cube.addCard.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await cardController.create(req, res)

      // Verify
      expect(db.magic.card.create).toHaveBeenCalled()
      expect(db.magic.cube.addCard).toHaveBeenCalledWith(req.cube, mockCreatedCard)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      // Restore console.error
      consoleErrorSpy.mockRestore()
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

    it('should handle scar application and update cube scarlist', async () => {
      // Setup
      const cardId = new ObjectId('507f1f77bcf86cd799439013')
      const cubeId = new ObjectId('507f1f77bcf86cd799439014')
      const mockCardData = { name: 'Updated Card', type: 'Creature', cubeId }
      const CubeWrapper = magic.util.wrapper.cube
      const cube = new CubeWrapper(CubeWrapper.blankCube())
      cube._id = cubeId
      cube.name = 'Test Cube'
      cube.scarlist = [{ id: 'scar1', text: 'Test scar' }]

      const mockUpdatedCard = {
        _id: cardId,
        data: mockCardData,
        cubeId,
        edits: [{
          userId: req.user._id,
          comment: 'Applied scar:\nTest scar',
          date: expect.any(Date),
          oldData: { name: 'Old Card', type: 'Creature' }
        }]
      }

      req.body.cardId = cardId
      req.body.cardData = mockCardData
      req.body.scar = { id: 'scar1', text: 'Test scar' }

      db.magic.cube.findById.mockResolvedValueOnce(cube)
      db.magic.card.update.mockResolvedValueOnce(mockUpdatedCard)

      // Execute
      await cardController.update(req, res)

      // Verify
      expect(db.magic.cube.findById).toHaveBeenCalledWith(cubeId)
      expect(db.magic.cube.updateScarlist).toHaveBeenCalledWith(cube)
      expect(db.magic.card.update).toHaveBeenCalledWith(
        cardId,
        mockCardData,
        req.user,
        'Applied scar:\nTest scar'
      )
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        card: mockUpdatedCard
      })
    })

    it('should return error when applying scar to card without cubeId', async () => {
      // Setup
      const cardId = new ObjectId('507f1f77bcf86cd799439013')
      const mockCardData = { name: 'Updated Card', type: 'Creature' } // No cubeId

      req.body.cardId = cardId
      req.body.cardData = mockCardData
      req.body.scar = { id: 'scar123', text: 'Test scar text' }

      // Execute
      await cardController.update(req, res)

      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Cannot apply a scar to a card with no associated cube'
      })
    })

    it('should preserve custom comment when applying scar', async () => {
      // Setup
      const cardId = new ObjectId('507f1f77bcf86cd799439013')
      const cubeId = new ObjectId('507f1f77bcf86cd799439014')
      const mockCardData = { name: 'Updated Card', type: 'Creature', cubeId }
      const CubeWrapper = magic.util.wrapper.cube
      const cube = new CubeWrapper(CubeWrapper.blankCube())
      cube._id = cubeId
      cube.name = 'Test Cube'
      cube.scarlist = [{ id: 'scar1', text: 'Test scar' }]
      const mockUpdatedCard = {
        _id: cardId,
        data: mockCardData,
        cubeId,
        edits: [{
          userId: req.user._id,
          comment: 'Custom comment',
          date: expect.any(Date),
          oldData: { name: 'Old Card', type: 'Creature' }
        }]
      }

      req.body.cardId = cardId
      req.body.cardData = mockCardData
      req.body.scar = { id: 'scar1', text: 'Test scar' }
      req.body.comment = 'Custom comment'

      db.magic.cube.findById.mockResolvedValueOnce(cube)
      db.magic.card.update.mockResolvedValueOnce(mockUpdatedCard)

      // Execute
      await cardController.update(req, res)

      // Verify
      expect(db.magic.cube.findById).toHaveBeenCalledWith(cubeId)
      expect(db.magic.cube.updateScarlist).toHaveBeenCalledWith(cube)
      expect(db.magic.card.update).toHaveBeenCalledWith(
        cardId,
        mockCardData,
        req.user,
        'Custom comment'
      )
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        card: mockUpdatedCard
      })
    })
  })

  describe('versions', () => {
    it('should fetch card versions and return success response', async () => {
      // Setup
      const mockVersions = [
        { version: '1.0', date: new Date() },
        { version: '2.0', date: new Date() }
      ]
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

    it('should handle errors when fetching versions', async () => {
      // Setup
      const errorMessage = 'Failed to fetch versions'
      db.magic.card.versions.mockRejectedValueOnce(new Error(errorMessage))

      // Mock console.error to prevent log output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Execute
      await cardController.versions(req, res)

      // Verify
      expect(db.magic.card.versions).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })
})

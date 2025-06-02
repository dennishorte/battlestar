import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as linkController from '../../../../src/controllers/magic/link_controller.js'
import { ObjectId } from 'mongodb'

// Mock dependencies
vi.mock('../../../../src/models/db', () => {
  return {
    default: {
      magic: {
        link: {
          create: vi.fn(),
          findAll: vi.fn(),
          delete: vi.fn()
        }
      }
    }
  }
})

import db from '../../../../src/models/db.js'

describe('Link Controller', () => {
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
    it('should create a new link and return success response', async () => {
      // Setup
      const mockLinkData = {
        name: 'Test Link',
        url: 'https://example.com',
        cardId: new ObjectId('507f1f77bcf86cd799439013')
      }
      const mockCreatedLink = {
        _id: new ObjectId('507f1f77bcf86cd799439014'),
        ...mockLinkData,
        userId: req.user._id,
        createdAt: expect.any(Date)
      }

      req.body.linkData = mockLinkData
      db.magic.link.create.mockResolvedValueOnce(mockCreatedLink)

      // Execute
      await linkController.create(req, res)

      // Verify
      expect(db.magic.link.create).toHaveBeenCalledWith(mockLinkData, req.user)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        link: mockCreatedLink
      })
    })

    it('should return error when linkData is missing', async () => {
      // Execute
      await linkController.create(req, res)

      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required field: linkData'
      })
    })

    it('should handle errors during link creation', async () => {
      // Setup
      req.body.linkData = {
        name: 'Test Link',
        url: 'https://example.com',
        cardId: new ObjectId('507f1f77bcf86cd799439013')
      }

      // Mock console.error to prevent log output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const errorMessage = 'Failed to create link'
      db.magic.link.create.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await linkController.create(req, res)

      // Verify
      expect(db.magic.link.create).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('findAll', () => {
    it('should find all links for a card', async () => {
      // Setup
      const cardId = new ObjectId('507f1f77bcf86cd799439013')
      const mockLinks = [
        {
          _id: new ObjectId(),
          name: 'Link 1',
          url: 'https://example.com/1',
          cardId,
          userId: req.user._id
        },
        {
          _id: new ObjectId(),
          name: 'Link 2',
          url: 'https://example.com/2',
          cardId,
          userId: req.user._id
        }
      ]

      req.body.cardId = cardId
      db.magic.link.findAll.mockResolvedValueOnce(mockLinks)

      // Execute
      await linkController.findAll(req, res)

      // Verify
      expect(db.magic.link.findAll).toHaveBeenCalledWith(cardId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        links: mockLinks
      })
    })

    it('should return error when cardId is missing', async () => {
      // Execute
      await linkController.findAll(req, res)

      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required field: cardId'
      })
    })

    it('should handle errors when finding links', async () => {
      // Setup
      req.body.cardId = new ObjectId('507f1f77bcf86cd799439013')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorMessage = 'Failed to find links'
      db.magic.link.findAll.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await linkController.findAll(req, res)

      // Verify
      expect(db.magic.link.findAll).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('delete', () => {
    it('should delete a link and return success response', async () => {
      // Setup
      const linkId = new ObjectId('507f1f77bcf86cd799439014')
      req.body.linkId = linkId
      db.magic.link.delete.mockResolvedValueOnce({ deletedCount: 1 })

      // Execute
      await linkController.deleteLink(req, res)

      // Verify
      expect(db.magic.link.delete).toHaveBeenCalledWith(linkId, req.user)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return error when linkId is missing', async () => {
      // Execute
      await linkController.deleteLink(req, res)

      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required field: linkId'
      })
    })

    it('should handle errors during link deletion', async () => {
      // Setup
      req.body.linkId = new ObjectId('507f1f77bcf86cd799439014')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorMessage = 'Failed to delete link'
      db.magic.link.delete.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await linkController.deleteLink(req, res)

      // Verify
      expect(db.magic.link.delete).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })
})

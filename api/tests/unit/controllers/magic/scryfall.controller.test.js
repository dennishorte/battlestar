import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock MongoDB client
vi.mock('../../../../src/utils/mongo.js', () => {
  return {
    client: {
      db: vi.fn(() => ({
        collection: vi.fn(() => ({
          find: vi.fn(),
          findOne: vi.fn(),
          insertOne: vi.fn(),
          updateOne: vi.fn(),
          deleteOne: vi.fn()
        }))
      }))
    }
  }
})

// Mock DB
vi.mock('../../../../src/models/db.js', () => {
  return {
    default: {
      magic: {
        scryfall: {
          update: vi.fn()
        }
      }
    }
  }
})

import * as scryfallController from '../../../../src/controllers/magic/scryfall.controller.js'
import db from '../../../../src/models/db.js'

describe('Scryfall Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      query: {}
    }
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    vi.clearAllMocks()
  })

  describe('update', () => {
    it('should update Scryfall data and return success response', async () => {
      // Setup
      const mockUpdateResult = {
        cardsAdded: 100,
        cardsUpdated: 50
      }

      db.magic.scryfall.update.mockResolvedValueOnce(mockUpdateResult)

      // Execute
      await scryfallController.update(req, res)

      // Verify
      expect(db.magic.scryfall.update).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Scryfall data updated',
        ...mockUpdateResult
      })
    })

    it('should handle errors during update', async () => {
      // Setup
      const errorMessage = 'Failed to update Scryfall data'

      // Mock console.error to prevent log output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      db.magic.scryfall.update.mockRejectedValueOnce(new Error(errorMessage))

      // Execute
      await scryfallController.update(req, res)

      // Verify
      expect(db.magic.scryfall.update).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: errorMessage
      })

      consoleErrorSpy.mockRestore()
    })
  })
})

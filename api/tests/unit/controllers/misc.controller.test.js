import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock logger
vi.mock('../../../src/utils/logger', () => {
  return {
    default: {
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn()
    }
  }
})

// Mock db
vi.mock('../../../src/models/db', () => {
  return {
    default: {
      misc: {
        appVersion: vi.fn().mockResolvedValue('1.0.0')
      }
    }
  }
})

// Import after mocks are set up
import * as miscController from '../../../src/controllers/misc.controller.js'
import db from '../../../src/models/db.js'
import logger from '../../../src/utils/logger.js'

describe('Misc Controller', () => {
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

  describe('getAppVersion', () => {
    it('should return the application version', async () => {
      // Execute
      await miscController.getAppVersion(req, res, next)

      // Verify
      expect(db.misc.appVersion).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        version: '1.0.0'
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      const error = new Error('Database error')
      db.misc.appVersion.mockRejectedValueOnce(error)

      // Execute
      await miscController.getAppVersion(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

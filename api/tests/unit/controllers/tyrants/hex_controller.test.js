import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock logger
vi.mock('../../../../src/utils/logger', () => {
  return {
    default: {
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn()
    }
  }
})

// Mock db
vi.mock('../../../../src/models/db', () => {
  return {
    default: {
      tyrants: {
        hex: {
          fetchAll: vi.fn().mockResolvedValue([
            { _id: 'hex1', name: 'Hex One', data: {} },
            { _id: 'hex2', name: 'Hex Two', data: {} }
          ]),
          delete: vi.fn().mockResolvedValue(true),
          save: vi.fn().mockResolvedValue(true)
        }
      }
    }
  }
})

// Import after mocks are set up
import * as hexController from '../../../../src/controllers/tyrants/hex_controller.js'
import { BadRequestError } from '../../../../src/utils/errors.js'
import db from '../../../../src/models/db.js'
import logger from '../../../../src/utils/logger.js'

describe('Tyrants Hex Controller', () => {
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

  describe('getAllHexes', () => {
    it('should return all hexes', async () => {
      // Execute
      await hexController.getAllHexes(req, res, next)

      // Verify
      expect(db.tyrants.hex.fetchAll).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        hexes: expect.arrayContaining([
          expect.objectContaining({ _id: 'hex1' }),
          expect.objectContaining({ _id: 'hex2' })
        ])
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      const error = new Error('Database error')
      db.tyrants.hex.fetchAll.mockRejectedValueOnce(error)

      // Execute
      await hexController.getAllHexes(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteHex', () => {
    it('should delete a hex with a valid ID', async () => {
      // Setup
      req.body = { id: 'hex1' }

      // Execute
      await hexController.deleteHex(req, res, next)

      // Verify
      expect(db.tyrants.hex.delete).toHaveBeenCalledWith('hex1')
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if id is missing', async () => {
      // Execute
      await hexController.deleteHex(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.tyrants.hex.delete).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { id: 'hex1' }
      const error = new Error('Database error')
      db.tyrants.hex.delete.mockRejectedValueOnce(error)

      // Execute
      await hexController.deleteHex(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('saveHex', () => {
    it('should save a hex with valid data', async () => {
      // Setup
      const hexData = { _id: 'hex1', name: 'Updated Hex', data: { key: 'value' } }
      req.body = { hex: hexData }

      // Execute
      await hexController.saveHex(req, res, next)

      // Verify
      expect(db.tyrants.hex.save).toHaveBeenCalledWith(hexData)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if hex data is missing', async () => {
      // Execute
      await hexController.saveHex(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.tyrants.hex.save).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { hex: { _id: 'hex1' } }
      const error = new Error('Database error')
      db.tyrants.hex.save.mockRejectedValueOnce(error)

      // Execute
      await hexController.saveHex(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

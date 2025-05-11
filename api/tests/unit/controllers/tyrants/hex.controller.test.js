// Mock logger
jest.mock('../../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock db
jest.mock('../../../../src/models/db', () => ({
  tyrants: {
    hex: {
      fetchAll: jest.fn().mockResolvedValue([
        { _id: 'hex1', name: 'Hex One', data: {} },
        { _id: 'hex2', name: 'Hex Two', data: {} }
      ]),
      delete: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true)
    }
  }
}))

// Import after mocks are set up
const hexController = require('../../../../src/controllers/tyrants/hex.controller')
const { BadRequestError } = require('../../../../src/utils/errors')
const db = require('../../../../src/models/db')
const logger = require('../../../../src/utils/logger')

describe('Tyrants Hex Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()

    jest.clearAllMocks()
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

// Mock logger
jest.mock('../../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock db
jest.mock('../../../../src/models/db', () => ({
  magic: {
    card: {
      create: jest.fn().mockResolvedValue('new-card-id'),
      delete: jest.fn().mockResolvedValue(true),
      duplicate: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true)
    },
    cube: {
      create: jest.fn().mockResolvedValue('new-cube-id'),
      delete: jest.fn().mockResolvedValue(true),
      duplicate: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true)
    },
    deck: {
      create: jest.fn().mockResolvedValue('new-deck-id'),
      delete: jest.fn().mockResolvedValue(true),
      duplicate: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true)
    }
  }
}))

// Import after mocks are set up
const fileController = require('../../../../src/controllers/magic/file.controller')
const { BadRequestError } = require('../../../../src/utils/errors')
const db = require('../../../../src/models/db')
const logger = require('../../../../src/utils/logger')

describe('Magic File Controller', () => {
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

  describe('createFile', () => {
    it('should create a new file with valid data', async () => {
      // Setup
      req.body = { kind: 'cube', name: 'Test Cube' }

      // Execute
      await fileController.createFile(req, res, next)

      // Verify
      expect(db.magic.cube.create).toHaveBeenCalledWith(req.body)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        fileId: 'new-cube-id'
      })
    })

    it('should return BadRequestError if kind is missing', async () => {
      // Execute
      await fileController.createFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.create).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if kind is invalid', async () => {
      // Setup
      req.body = { kind: 'invalid' }

      // Execute
      await fileController.createFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.create).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { kind: 'cube' }
      const error = new Error('Database error')
      db.magic.cube.create.mockRejectedValueOnce(error)

      // Execute
      await fileController.createFile(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteFile', () => {
    it('should delete a file with valid data', async () => {
      // Setup
      req.body = { kind: 'cube', fileId: 'cube-id' }

      // Execute
      await fileController.deleteFile(req, res, next)

      // Verify
      expect(db.magic.cube.delete).toHaveBeenCalledWith('cube-id')
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if kind is missing', async () => {
      // Setup
      req.body = { fileId: 'cube-id' }

      // Execute
      await fileController.deleteFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.delete).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if fileId is missing', async () => {
      // Setup
      req.body = { kind: 'cube' }

      // Execute
      await fileController.deleteFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.delete).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { kind: 'cube', fileId: 'cube-id' }
      const error = new Error('Database error')
      db.magic.cube.delete.mockRejectedValueOnce(error)

      // Execute
      await fileController.deleteFile(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('duplicateFile', () => {
    it('should duplicate a file with valid data', async () => {
      // Setup
      req.body = { kind: 'cube', fileId: 'cube-id' }

      // Execute
      await fileController.duplicateFile(req, res, next)

      // Verify
      expect(db.magic.cube.duplicate).toHaveBeenCalledWith('cube-id')
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if kind is missing', async () => {
      // Setup
      req.body = { fileId: 'cube-id' }

      // Execute
      await fileController.duplicateFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.duplicate).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if fileId is missing', async () => {
      // Setup
      req.body = { kind: 'cube' }

      // Execute
      await fileController.duplicateFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.duplicate).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { kind: 'cube', fileId: 'cube-id' }
      const error = new Error('Database error')
      db.magic.cube.duplicate.mockRejectedValueOnce(error)

      // Execute
      await fileController.duplicateFile(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('saveFile', () => {
    it('should save a file with valid data', async () => {
      // Setup
      req.body = { 
        file: { 
          _id: 'cube-id', 
          kind: 'cube', 
          name: 'Updated Cube' 
        } 
      }

      // Execute
      await fileController.saveFile(req, res, next)

      // Verify
      expect(db.magic.cube.save).toHaveBeenCalledWith(req.body.file)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if file data is missing', async () => {
      // Execute
      await fileController.saveFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should return BadRequestError if file._id is missing', async () => {
      // Setup
      req.body = { file: { kind: 'cube' } }

      // Execute
      await fileController.saveFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should return BadRequestError if file.kind is invalid', async () => {
      // Setup
      req.body = { file: { _id: 'cube-id', kind: 'invalid' } }

      // Execute
      await fileController.saveFile(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { 
        file: { 
          _id: 'cube-id', 
          kind: 'cube' 
        } 
      }
      const error = new Error('Database error')
      db.magic.cube.save.mockRejectedValueOnce(error)

      // Execute
      await fileController.saveFile(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
}) 

// Mock logger
jest.mock('../../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock db
jest.mock('../../../../src/models/db', () => ({
  magic: {
    cube: {
      create: jest.fn().mockResolvedValue('new-cube-id'),
      findById: jest.fn().mockResolvedValue({
        _id: 'new-cube-id',
        name: 'Test Cube',
        cards: []
      }),
      collection: {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { _id: 'cube1', name: 'Public Cube 1', public: true },
            { _id: 'cube2', name: 'Public Cube 2', public: true }
          ])
        })
      },
      save: jest.fn().mockResolvedValue(true),
      setEditFlag: jest.fn().mockResolvedValue(true),
      setPublicFlag: jest.fn().mockResolvedValue(true)
    }
  }
}))

// Import after mocks are set up
const cubeController = require('../../../../src/controllers/magic/cube.controller')
const { BadRequestError, NotFoundError } = require('../../../../src/utils/errors')
const db = require('../../../../src/models/db')
const logger = require('../../../../src/utils/logger')

describe('Magic Cube Controller', () => {
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

  describe('createCube', () => {
    it('should create a new cube', async () => {
      // Setup
      req.body = { name: 'Test Cube' }

      // Execute
      await cubeController.createCube(req, res, next)

      // Verify
      expect(db.magic.cube.create).toHaveBeenCalledWith(req.body)
      expect(db.magic.cube.findById).toHaveBeenCalledWith('new-cube-id')
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube: expect.objectContaining({ _id: 'new-cube-id', name: 'Test Cube' })
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { name: 'Test Cube' }
      const error = new Error('Database error')
      db.magic.cube.create.mockRejectedValueOnce(error)

      // Execute
      await cubeController.createCube(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getCube', () => {
    it('should fetch a cube by ID', async () => {
      // Setup
      req.body = { cubeId: 'cube1' }
      const cube = { _id: 'cube1', name: 'Test Cube', cards: [] }
      req.cube = cube // Add cube directly to request as middleware would

      // Execute
      await cubeController.getCube(req, res, next)

      // Verify
      // No need to check db.magic.cube.findById since the implementation uses req.cube
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube
      })
    })

    it('should return BadRequestError if cubeId is missing', async () => {
      // Execute
      await cubeController.getCube(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should return NotFoundError if cube is not found', async () => {
      // Setup
      req.body = { cubeId: 'nonexistent' }
      req.cube = null

      // Execute
      await cubeController.getCube(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { cubeId: 'cube1' }
      req.cube = { _id: 'cube1' }

      // Force an error to occur in the try block
      res.json = jest.fn(() => {
        throw new Error('Database error')
      })

      // Execute
      await cubeController.getCube(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('getPublicCubes', () => {
    it('should fetch all public cubes', async () => {
      // Execute
      await cubeController.getPublicCubes(req, res, next)

      // Verify
      expect(db.magic.cube.collection.find).toHaveBeenCalledWith({ public: true })
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cubes: expect.arrayContaining([
          expect.objectContaining({ _id: 'cube1' }),
          expect.objectContaining({ _id: 'cube2' })
        ])
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      const error = new Error('Database error')
      db.magic.cube.collection.find.mockImplementationOnce(() => {
        throw error
      })

      // Execute
      await cubeController.getPublicCubes(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('saveCube', () => {
    it('should save a cube', async () => {
      // Setup
      const cube = { _id: 'cube1', name: 'Updated Cube' }
      req.body = { cube }

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(db.magic.cube.save).toHaveBeenCalledWith(cube)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if cube data is missing', async () => {
      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.save).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if cube._id is missing', async () => {
      // Setup
      req.body = { cube: { name: 'Invalid Cube' } }

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.save).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { cube: { _id: 'cube1', name: 'Updated Cube' } }
      const error = new Error('Database error')
      db.magic.cube.save.mockRejectedValueOnce(error)

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('setEditFlag', () => {
    it('should set the edit flag', async () => {
      // Setup
      req.body = { editFlag: true }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setEditFlag(req, res, next)

      // Verify
      expect(db.magic.cube.setEditFlag).toHaveBeenCalledWith('cube1', true)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if editFlag is missing', async () => {
      // Execute
      await cubeController.setEditFlag(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.setEditFlag).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { editFlag: true }
      req.cube = { _id: 'cube1' }
      const error = new Error('Database error')
      db.magic.cube.setEditFlag.mockRejectedValueOnce(error)

      // Execute
      await cubeController.setEditFlag(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('setPublicFlag', () => {
    it('should set the public flag', async () => {
      // Setup
      req.body = { publicFlag: true }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setPublicFlag(req, res, next)

      // Verify
      expect(db.magic.cube.setPublicFlag).toHaveBeenCalledWith('cube1', true)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if publicFlag is undefined', async () => {
      // Execute
      await cubeController.setPublicFlag(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(db.magic.cube.setPublicFlag).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { publicFlag: true }
      req.cube = { _id: 'cube1' }
      const error = new Error('Database error')
      db.magic.cube.setPublicFlag.mockRejectedValueOnce(error)

      // Execute
      await cubeController.setPublicFlag(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

// Mock logger
jest.mock('../../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock cube models
jest.mock('../../../../src/models/magic/cube_models', () => ({
  create: jest.fn().mockResolvedValue({
    _id: 'new-cube-id',
    name: 'New Cube',
    cardlist: []
  }),
  findById: jest.fn().mockResolvedValue({
    _id: 'new-cube-id',
    name: 'Test Cube',
    cardlist: []
  }),
  save: jest.fn().mockResolvedValue(true),
  setFlag: jest.fn().mockResolvedValue(true)
}))

// Mock db to use the cube models
jest.mock('../../../../src/models/db', () => ({
  magic: {
    cube: require('../../../../src/models/magic/cube_models')
  }
}))

// Import after mocks are set up
const cubeController = require('../../../../src/controllers/magic/cube.controller')
const { BadRequestError, NotFoundError } = require('../../../../src/utils/errors')
const logger = require('../../../../src/utils/logger')
const cubeModels = require('../../../../src/models/magic/cube_models')

describe('Magic Cube Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: 'test-user-id' },
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
      // Execute
      await cubeController.createCube(req, res, next)

      // Verify
      expect(cubeModels.create).toHaveBeenCalledWith(req.user)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube: expect.objectContaining({
          _id: 'new-cube-id',
          name: 'New Cube'
        })
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      const error = new Error('Database error')
      cubeModels.create.mockRejectedValueOnce(error)

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
      const cube = { _id: 'cube1', name: 'Test Cube', cardlist: [] }
      req.cube = cube // Add cube directly to request as middleware would

      // Execute
      await cubeController.getCube(req, res, next)

      // Verify
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

  describe('saveCube', () => {
    it('should save a cube', async () => {
      // Setup
      const cube = { _id: 'cube1', name: 'Updated Cube' }
      req.body = { cube }

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(cubeModels.save).toHaveBeenCalledWith(cube)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if cube data is missing', async () => {
      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.save).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if cube._id is missing', async () => {
      // Setup
      req.body = { cube: { name: 'Invalid Cube' } }

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.save).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { cube: { _id: 'cube1', name: 'Updated Cube' } }
      const error = new Error('Database error')
      cubeModels.save.mockRejectedValueOnce(error)

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('setFlag', () => {
    it('should set a flag', async () => {
      // Setup
      req.body = { name: 'legacy', value: true }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setFlag(req, res, next)

      // Verify
      expect(cubeModels.setFlag).toHaveBeenCalledWith('cube1', 'legacy', true)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if name is missing', async () => {
      // Setup
      req.body = { value: true }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setFlag(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.setFlag).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if value is missing', async () => {
      // Setup
      req.body = { name: 'legacy' }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setFlag(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.setFlag).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if flag name is invalid', async () => {
      // Setup
      req.body = { name: 'invalid', value: true }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setFlag(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.setFlag).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if value is not boolean', async () => {
      // Setup
      req.body = { name: 'legacy', value: 'not-a-boolean' }
      req.cube = { _id: 'cube1' }

      // Execute
      await cubeController.setFlag(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.setFlag).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = { name: 'legacy', value: true }
      req.cube = { _id: 'cube1' }
      const error = new Error('Database error')
      cubeModels.setFlag.mockRejectedValueOnce(error)

      // Execute
      await cubeController.setFlag(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

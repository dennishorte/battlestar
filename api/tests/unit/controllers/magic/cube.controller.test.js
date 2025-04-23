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
  save: jest.fn().mockResolvedValue(true)
}))

// Mock card models
jest.mock('../../../../src/models/magic/card_models', () => ({
  findByIds: jest.fn().mockImplementation(ids => {
    return ids.map(id => ({ _id: id, name: `Card ${id}`, cubeId: 'new-cube-id' }))
  }),
  create: jest.fn().mockImplementation((card, cube) => Promise.resolve({
    _id: card._id,
    name: card.name,
    cubeId: cube._id
  })),
  deactivate: jest.fn().mockResolvedValue(true)
}))

// Mock db to use the cube models and include card models
jest.mock('../../../../src/models/db', () => ({
  magic: {
    cube: require('../../../../src/models/magic/cube_models'),
    card: require('../../../../src/models/magic/card_models')
  }
}))

// Import after mocks are set up
const cubeController = require('../../../../src/controllers/magic/cube.controller')
const { BadRequestError, NotFoundError } = require('../../../../src/utils/errors')
const logger = require('../../../../src/utils/logger')
const cubeModels = require('../../../../src/models/magic/cube_models')
const db = require('../../../../src/models/db')

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
      req.body = { cube: { _id: 'cube1', name: 'Updated Cube' } }

      // Execute
      await cubeController.saveCube(req, res, next)

      // Verify
      expect(cubeModels.save).toHaveBeenCalledWith({ _id: 'cube1', name: 'Updated Cube' })
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })

    it('should return BadRequestError if cube is missing', async () => {
      // Setup
      req.body = {}

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

  describe('addRemoveCards', () => {
    it('should add and remove cards from a cube', async () => {
      // Setup
      req.body = {
        addIds: ['card1', 'card2'],
        removeIds: ['card3', 'card4'],
        comment: 'Test batch operation'
      }
      req.cube = { _id: 'new-cube-id', name: 'Test Cube' }
      req.user = { _id: 'test-user-id' }

      // Mock the cube.addCard function
      db.magic.cube.addCard = jest.fn().mockResolvedValue(true)
      db.magic.cube.removeCard = jest.fn().mockResolvedValue(true)

      // Execute
      await cubeController.addRemoveCards(req, res, next)

      // Verify
      expect(db.magic.card.findByIds).toHaveBeenCalledWith(['card1', 'card2'])
      expect(db.magic.card.findByIds).toHaveBeenCalledWith(['card3', 'card4'])
      expect(db.magic.card.create).toHaveBeenCalledTimes(2)
      expect(db.magic.cube.addCard).toHaveBeenCalledTimes(2)
      expect(db.magic.card.deactivate).toHaveBeenCalledTimes(2)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        addResults: expect.arrayContaining([
          expect.objectContaining({ status: 'success' })
        ]),
        removeResults: expect.arrayContaining([
          expect.objectContaining({ status: 'success' })
        ])
      })
    })

    it('should handle empty add/remove arrays', async () => {
      // Setup
      req.body = {
        addIds: [],
        removeIds: [],
        comment: 'Test empty operation'
      }
      req.cube = { _id: 'new-cube-id', name: 'Test Cube' }
      req.user = { _id: 'test-user-id' }

      // Execute
      await cubeController.addRemoveCards(req, res, next)

      // Verify
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        addResults: [],
        removeResults: []
      })
    })

    it('should return 404 if cube is not found', async () => {
      // Setup
      req.body = {
        addIds: ['card1'],
        removeIds: ['card2']
      }
      req.cube = null // Simulate cube not found

      // Execute
      await cubeController.addRemoveCards(req, res, next)

      // Verify
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Cube not found'
      })
    })

    it('should return 400 if both addIds and removeIds are missing', async () => {
      // Setup
      req.body = { comment: 'Test invalid operation' }
      req.cube = { _id: 'new-cube-id', name: 'Test Cube' }

      // Execute
      await cubeController.addRemoveCards(req, res, next)

      // Verify
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required fields: addIds or removeIds are required'
      })
    })

    it('should handle errors during card addition/removal', async () => {
      // Setup
      req.body = {
        addIds: ['card1', 'card2'],
        removeIds: ['card3'],
        comment: 'Test error handling'
      }
      req.cube = { _id: 'new-cube-id', name: 'Test Cube' }
      req.user = { _id: 'test-user-id' }

      // Mock failure for one card
      db.magic.card.create.mockImplementationOnce(() => {
        throw new Error('Failed to create card')
      })
      db.magic.card.deactivate.mockImplementationOnce(() => {
        throw new Error('Failed to deactivate card')
      })
      db.magic.cube.addCard = jest.fn().mockResolvedValue(true)

      // Execute
      await cubeController.addRemoveCards(req, res, next)

      // Verify
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        addResults: expect.arrayContaining([
          expect.objectContaining({ status: 'error' }),
          expect.objectContaining({ status: 'success' })
        ]),
        removeResults: expect.arrayContaining([
          expect.objectContaining({ status: 'error' })
        ])
      })
    })
  })

  describe('updateSettings', () => {
    it('should update cube settings including name', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1',
        settings: {
          name: 'Updated Cube Name'
        }
      }
      req.cube = { _id: 'cube1', name: 'Old Name' }

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(cubeModels.save).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'cube1',
        name: 'Updated Cube Name'
      }))
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube: expect.objectContaining({
          _id: 'cube1',
          name: 'Updated Cube Name'
        })
      })
    })

    it('should update cube legacy flag', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1',
        settings: {
          legacy: true
        }
      }
      req.cube = { _id: 'cube1', name: 'Test Cube', flags: { legacy: false } }

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(cubeModels.save).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'cube1',
        flags: { legacy: true }
      }))
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube: expect.objectContaining({
          _id: 'cube1',
          flags: { legacy: true }
        })
      })
    })

    it('should create flags object if not exists when setting legacy flag', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1',
        settings: {
          legacy: true
        }
      }
      req.cube = { _id: 'cube1', name: 'Test Cube' }

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(cubeModels.save).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'cube1',
        flags: { legacy: true }
      }))
    })

    it('should return BadRequestError if cubeId is missing', async () => {
      // Setup
      req.body = {
        settings: {
          name: 'Updated Cube'
        }
      }

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.save).not.toHaveBeenCalled()
    })

    it('should return BadRequestError if settings object is missing', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1'
      }

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(cubeModels.save).not.toHaveBeenCalled()
    })

    it('should return NotFoundError if cube is not found', async () => {
      // Setup
      req.body = {
        cubeId: 'nonexistent',
        settings: {
          name: 'Updated Cube'
        }
      }
      req.cube = null

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(cubeModels.save).not.toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1',
        settings: {
          name: 'Updated Cube'
        }
      }
      req.cube = { _id: 'cube1', name: 'Old Name' }
      const error = new Error('Database error')
      cubeModels.save.mockRejectedValueOnce(error)

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

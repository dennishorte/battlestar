import { describe, it, expect, beforeEach, vi } from 'vitest'
import CubeWrapper from '../../../../common/magic/util/cube.wrapper.js'

// Mock battlestar-common first
vi.mock('battlestar-common', () => {
  const mockCubeWrapper = {
    deleteAchievement: vi.fn(),
    upsertAchievement: vi.fn(),
    toJSON: vi.fn().mockReturnValue({ _id: 'cube1', name: 'Test Cube', achievementlist: [] })
  }

  return {
    magic: {
      util: {
        wrapper: {
          cube: vi.fn().mockReturnValue(mockCubeWrapper)
        }
      }
    }
  }
})

// Mock the entire db module
vi.mock('../../../../src/models/db.js', () => {
  return {
    default: {
      magic: {
        cube: {
          create: vi.fn().mockResolvedValue({
            _id: 'new-cube-id',
            name: 'New Cube',
            cardlist: []
          }),
          findById: vi.fn().mockResolvedValue({
            _id: 'new-cube-id',
            name: 'Test Cube',
            cardlist: []
          }),
          save: vi.fn().mockResolvedValue(true),
          addCard: vi.fn().mockResolvedValue(true),
          removeCard: vi.fn().mockResolvedValue(true),
          updateScarlist: vi.fn().mockResolvedValue(true),
          updateAchievementlist: vi.fn().mockResolvedValue(true)
        },
        card: {
          findByIds: vi.fn().mockImplementation(ids => {
            return ids.map(id => ({ _id: id, name: `Card ${id}`, cubeId: 'new-cube-id' }))
          }),
          create: vi.fn().mockImplementation((card, cube, user, comment) => Promise.resolve({
            _id: card._id || 'new-card-id',
            name: card.name || 'New Card',
            cubeId: cube._id,
            userId: user._id,
            comment
          })),
          deactivate: vi.fn().mockResolvedValue(true)
        }
      }
    }
  }
})

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

// Import after mocks are set up
import * as cubeController from '../../../../src/controllers/magic/cube.controller.js'
import { BadRequestError, NotFoundError } from '../../../../src/utils/errors.js'
import logger from '../../../../src/utils/logger.js'
import db from '../../../../src/models/db.js'

// Fixture for creating a test cube and wrapper
function makeTestCube() {
  const cube = CubeWrapper.blankCube()
  cube._id = 'cube1'
  cube.name = 'Test Cube'
  const wrapper = new CubeWrapper(cube)
  return { cube, wrapper }
}

describe('Magic Cube Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: 'test-user-id' },
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()

    vi.clearAllMocks()
  })

  describe('createCube', () => {
    it('should create a new cube', async () => {
      // Execute
      await cubeController.createCube(req, res, next)

      // Verify
      expect(db.magic.cube.create).toHaveBeenCalledWith(req.user)
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
      res.json = vi.fn(() => {
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
      expect(db.magic.cube.save).toHaveBeenCalledWith({ _id: 'cube1', name: 'Updated Cube' })
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

      // Mock successful card creation and deactivation
      db.magic.card.create.mockResolvedValueOnce({
        _id: 'card1',
        name: 'Card 1',
        cubeId: 'new-cube-id'
      })
      db.magic.card.create.mockResolvedValueOnce({
        _id: 'card2',
        name: 'Card 2',
        cubeId: 'new-cube-id'
      })
      db.magic.card.deactivate.mockResolvedValue(true)

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

      // Mock failure for first card creation
      db.magic.card.create.mockRejectedValueOnce(new Error('Failed to create card'))
      // Mock success for second card
      db.magic.card.create.mockResolvedValueOnce({
        _id: 'card2',
        name: 'Card 2',
        cubeId: 'new-cube-id'
      })
      // Mock failure for card deactivation
      db.magic.card.deactivate.mockRejectedValueOnce(new Error('Failed to deactivate card'))

      // Execute
      await cubeController.addRemoveCards(req, res, next)

      // Verify - need to check for specific structure in the results
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        addResults: [
          expect.objectContaining({
            id: 'card1',
            status: 'error',
            message: 'Failed to create card'
          }),
          expect.objectContaining({
            status: 'success'
          })
        ],
        removeResults: [
          expect.objectContaining({
            id: 'card3',
            status: 'error',
            message: 'Failed to deactivate card'
          })
        ]
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
      expect(db.magic.cube.save).toHaveBeenCalledWith(expect.objectContaining({
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
      expect(db.magic.cube.save).toHaveBeenCalledWith(expect.objectContaining({
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
      expect(db.magic.cube.save).toHaveBeenCalledWith(expect.objectContaining({
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
      expect(db.magic.cube.save).not.toHaveBeenCalled()
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
      expect(db.magic.cube.save).not.toHaveBeenCalled()
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
      expect(db.magic.cube.save).not.toHaveBeenCalled()
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
      db.magic.cube.save.mockRejectedValueOnce(error)

      // Execute
      await cubeController.updateSettings(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteAchievement', () => {
    it('should delete an achievement from a cube', async () => {
      req.body = {
        cubeId: 'cube1',
        achievement: {
          id: 'achievement-1',
          name: 'Test Achievement'
        }
      }
      // Use fixture
      const { cube, wrapper } = makeTestCube()
      const deleteAchievementSpy = vi.spyOn(wrapper, 'deleteAchievement')
      req.cube = cube

      // Execute
      await cubeController.deleteAchievement(req, res, next)

      // Verify
      expect(deleteAchievementSpy).toHaveBeenCalledWith(req.body.achievement)
      expect(db.magic.cube.updateAchievementlist).toHaveBeenCalledWith(expect.any(CubeWrapper))
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube: expect.objectContaining({
          _id: 'cube1',
          name: 'Test Cube'
        })
      })
    })

    it('should return BadRequestError if cubeId is missing', async () => {
      // Setup
      req.body = {
        achievement: {
          id: 'achievement-1'
        }
      }

      // Execute
      await cubeController.deleteAchievement(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should return BadRequestError if achievement object is missing', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1'
      }

      // Execute
      await cubeController.deleteAchievement(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should return NotFoundError if cube is not found', async () => {
      // Setup
      req.body = {
        cubeId: 'nonexistent',
        achievement: {
          id: 'achievement-1'
        }
      }
      req.cube = null

      // Execute
      await cubeController.deleteAchievement(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1',
        achievement: {
          id: 'achievement-1'
        }
      }
      req.cube = { _id: 'cube1' }
      const error = new Error('Database error')
      db.magic.cube.updateAchievementlist.mockRejectedValueOnce(error)

      // Execute
      await cubeController.deleteAchievement(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateAchievement', () => {
    it('should update an achievement in a cube', async () => {
      req.body = {
        cubeId: 'cube1',
        achievement: {
          id: 'achievement-1',
          name: 'Updated Achievement'
        }
      }
      // Use fixture
      const { cube, wrapper } = makeTestCube()
      const upsertAchievementSpy = vi.spyOn(wrapper, 'upsertAchievement')
      req.cube = cube

      // Execute
      await cubeController.updateAchievement(req, res, next)

      // Verify
      expect(upsertAchievementSpy).toHaveBeenCalledWith(req.body.achievement)
      expect(db.magic.cube.updateAchievementlist).toHaveBeenCalledWith(expect.any(CubeWrapper))
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cube: expect.objectContaining({
          _id: 'cube1',
          name: 'Test Cube'
        })
      })
    })

    it('should return BadRequestError if cubeId is missing', async () => {
      // Setup
      req.body = {
        achievement: {
          id: 'achievement-1'
        }
      }

      // Execute
      await cubeController.updateAchievement(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should return BadRequestError if achievement object is missing', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1'
      }

      // Execute
      await cubeController.updateAchievement(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    })

    it('should return NotFoundError if cube is not found', async () => {
      // Setup
      req.body = {
        cubeId: 'nonexistent',
        achievement: {
          id: 'achievement-1'
        }
      }
      req.cube = null

      // Execute
      await cubeController.updateAchievement(req, res, next)

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })

    it('should handle errors properly', async () => {
      // Setup
      req.body = {
        cubeId: 'cube1',
        achievement: {
          id: 'achievement-1'
        }
      }
      req.cube = { _id: 'cube1' }
      const error = new Error('Database error')
      db.magic.cube.updateAchievementlist.mockRejectedValueOnce(error)

      // Execute
      await cubeController.updateAchievement(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

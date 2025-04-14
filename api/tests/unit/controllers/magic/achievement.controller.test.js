const achievementController = require('../../../../src/controllers/magic/achievement.controller')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  magic: {
    achievement: {
      findByCubeId: jest.fn(),
      claim: jest.fn(),
      delete: jest.fn(),
      linkFilters: jest.fn(),
      save: jest.fn(),
      findById: jest.fn()
    }
  },
  user: {
    findById: jest.fn()
  }
}))

jest.mock('../../../../src/util/slack.js', () => ({
  sendToSlackId: jest.fn()
}))

jest.mock('battlestar-common', () => ({
  util: {
    assert: jest.fn((condition, message) => {
      if (!condition) {
        throw new Error(message)
      }
    })
  }
}))

const db = require('../../../../src/models/db')
const slack = require('../../../../src/util/slack.js')

describe('Achievement Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {}
    }
    res = {
      json: jest.fn()
    }
    jest.clearAllMocks()
  })

  describe('fetchAll', () => {
    it('should fetch all achievements for a cube and return success response', async () => {
      // Setup
      const mockCubeId = '507f1f77bcf86cd799439011'
      const mockAchievements = [
        { _id: '507f1f77bcf86cd799439022', name: 'Achievement 1' },
        { _id: '507f1f77bcf86cd799439033', name: 'Achievement 2' }
      ]
      
      req.body.cubeId = mockCubeId
      db.magic.achievement.findByCubeId.mockResolvedValueOnce(mockAchievements)
      
      // Execute
      await achievementController.fetchAll(req, res)
      
      // Verify
      expect(db.magic.achievement.findByCubeId).toHaveBeenCalledWith(mockCubeId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        achievements: mockAchievements
      })
    })
  })

  describe('claim', () => {
    it('should claim an achievement for a user, send notification, and return success response', async () => {
      // Setup
      const mockAchId = '507f1f77bcf86cd799439011'
      const mockUserId = '507f1f77bcf86cd799439022'
      
      req.body = {
        achId: mockAchId,
        userId: mockUserId
      }
      
      const mockAchievement = {
        _id: mockAchId,
        name: 'Test Achievement',
        unlock: 'Unlock condition',
        hidden: [{ name: 'Hidden Name', text: 'Hidden Text' }]
      }
      
      const mockUser = {
        _id: mockUserId,
        name: 'Test User'
      }
      
      db.magic.achievement.claim.mockResolvedValueOnce()
      db.magic.achievement.findById.mockResolvedValueOnce(mockAchievement)
      db.user.findById.mockResolvedValueOnce(mockUser)
      slack.sendToSlackId.mockResolvedValueOnce()
      
      // Execute
      await achievementController.claim(req, res)
      
      // Verify
      expect(db.magic.achievement.claim).toHaveBeenCalledWith(mockAchId, mockUserId)
      expect(db.magic.achievement.findById).toHaveBeenCalledWith(mockAchId)
      expect(db.user.findById).toHaveBeenCalledWith(mockUserId)
      expect(slack.sendToSlackId).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ status: 'success' })
    })
  })

  describe('delete', () => {
    it('should delete an achievement and return success response', async () => {
      // Setup
      const mockAchId = '507f1f77bcf86cd799439011'
      req.body.achId = mockAchId
      
      db.magic.achievement.delete.mockResolvedValueOnce()
      
      // Execute
      await achievementController.delete(req, res)
      
      // Verify
      expect(db.magic.achievement.delete).toHaveBeenCalledWith(mockAchId)
      expect(res.json).toHaveBeenCalledWith({ status: 'success' })
    })
  })

  describe('linkFilters', () => {
    it('should link filters to an achievement and return success response', async () => {
      // Setup
      const mockAchId = '507f1f77bcf86cd799439011'
      const mockFilters = [{ field: 'type', values: ['creature'] }]
      
      req.body = {
        achId: mockAchId,
        filters: mockFilters
      }
      
      db.magic.achievement.linkFilters.mockResolvedValueOnce()
      
      // Execute
      await achievementController.linkFilters(req, res)
      
      // Verify
      expect(db.magic.achievement.linkFilters).toHaveBeenCalledWith(mockAchId, mockFilters)
      expect(res.json).toHaveBeenCalledWith({ status: 'success' })
    })
  })

  describe('save', () => {
    it('should save a valid achievement and return success response', async () => {
      // Setup
      const mockAchievement = {
        name: ' Test Achievement ',
        unlock: ' Unlock condition ',
        hidden: [{ name: ' Hidden Name ', text: ' Hidden Text ' }],
        creatorId: '507f1f77bcf86cd799439022',
        cubeId: '507f1f77bcf86cd799439033'
      }
      
      req.body = {
        achievement: { ...mockAchievement }
      }
      
      db.magic.achievement.save.mockResolvedValueOnce()
      
      // Execute
      await achievementController.save(req, res)
      
      // Verify
      expect(db.magic.achievement.save).toHaveBeenCalledWith({
        ...mockAchievement,
        name: 'Test Achievement',
        unlock: 'Unlock condition',
        hidden: [{ name: 'Hidden Name', text: 'Hidden Text' }]
      })
      expect(res.json).toHaveBeenCalledWith({ status: 'success' })
    })

    it('should return error response when achievement validation fails', async () => {
      // Setup
      const mockAchievement = {
        name: '',
        unlock: 'Unlock condition',
        hidden: [{ name: 'Hidden Name', text: 'Hidden Text' }],
        creatorId: '507f1f77bcf86cd799439022',
        cubeId: '507f1f77bcf86cd799439033'
      }
      
      req.body = {
        achievement: mockAchievement
      }
      
      // Execute
      await achievementController.save(req, res)
      
      // Verify
      expect(db.magic.achievement.save).not.toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'No name specified'
      })
    })
  })
}) 
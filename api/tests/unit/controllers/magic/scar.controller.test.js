const scarController = require('../../../../src/controllers/magic/scar.controller')
const { util } = require('battlestar-common')

// Mock dependencies
jest.mock('battlestar-common', () => ({
  util: {
    array: {
      shuffle: jest.fn(arr => arr)
    }
  }
}))

jest.mock('../../../../src/models/db', () => ({
  magic: {
    scar: {
      apply: jest.fn(),
      fetchByCubeId: jest.fn(),
      fetchAvailable: jest.fn(),
      lock: jest.fn(),
      releaseByUser: jest.fn(),
      save: jest.fn()
    }
  }
}))

jest.mock('async-lock', () => {
  return function() {
    return {
      acquire: jest.fn((key, fn) => fn())
    }
  }
})

const db = require('../../../../src/models/db')

describe('Scar Controller', () => {
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

  describe('apply', () => {
    it('should apply a scar to cards and return success response', async () => {
      // Setup
      req.body = {
        scarId: '507f1f77bcf86cd799439011',
        userId: '507f1f77bcf86cd799439022',
        cardIdDict: { '507f1f77bcf86cd799439033': true }
      }
      
      db.magic.scar.apply.mockResolvedValueOnce()
      
      // Execute
      await scarController.apply(req, res)
      
      // Verify
      expect(db.magic.scar.apply).toHaveBeenCalledWith(
        req.body.scarId, 
        req.body.userId, 
        req.body.cardIdDict
      )
      expect(res.json).toHaveBeenCalledWith({ status: 'success' })
    })
  })

  describe('fetchAll', () => {
    it('should fetch all scars for a cube and return success response', async () => {
      // Setup
      const mockCubeId = '507f1f77bcf86cd799439011'
      const mockScars = [
        { _id: '507f1f77bcf86cd799439022', name: 'Test Scar 1' },
        { _id: '507f1f77bcf86cd799439033', name: 'Test Scar 2' }
      ]
      
      req.body.cubeId = mockCubeId
      db.magic.scar.fetchByCubeId.mockResolvedValueOnce(mockScars)
      
      // Execute
      await scarController.fetchAll(req, res)
      
      // Verify
      expect(db.magic.scar.fetchByCubeId).toHaveBeenCalledWith(mockCubeId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        scars: mockScars
      })
    })
  })

  describe('fetchAvailable', () => {
    it('should fetch available scars, shuffle them, and return a subset', async () => {
      // Setup
      const mockCubeId = '507f1f77bcf86cd799439011'
      const mockCount = 2
      const mockScars = [
        { _id: '507f1f77bcf86cd799439022', name: 'Test Scar 1' },
        { _id: '507f1f77bcf86cd799439033', name: 'Test Scar 2' },
        { _id: '507f1f77bcf86cd799439044', name: 'Test Scar 3' }
      ]
      
      req.body = {
        cubeId: mockCubeId,
        count: mockCount,
        lock: false
      }
      
      db.magic.scar.fetchAvailable.mockResolvedValueOnce(mockScars)
      
      // Execute
      await scarController.fetchAvailable(req, res)
      
      // Verify
      expect(db.magic.scar.fetchAvailable).toHaveBeenCalledWith(mockCubeId)
      expect(util.array.shuffle).toHaveBeenCalledWith(mockScars)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        scars: mockScars.slice(0, mockCount)
      })
      expect(db.magic.scar.lock).not.toHaveBeenCalled()
    })

    it('should lock scars if lock parameter is true', async () => {
      // Setup
      const mockCubeId = '507f1f77bcf86cd799439011'
      const mockUserId = '507f1f77bcf86cd799439055'
      const mockCount = 2
      const mockScars = [
        { _id: '507f1f77bcf86cd799439022', name: 'Test Scar 1' },
        { _id: '507f1f77bcf86cd799439033', name: 'Test Scar 2' }
      ]
      
      req.body = {
        cubeId: mockCubeId,
        userId: mockUserId,
        count: mockCount,
        lock: true
      }
      
      db.magic.scar.fetchAvailable.mockResolvedValueOnce(mockScars)
      db.magic.scar.lock.mockResolvedValueOnce()
      
      // Execute
      await scarController.fetchAvailable(req, res)
      
      // Verify
      expect(db.magic.scar.fetchAvailable).toHaveBeenCalledWith(mockCubeId)
      expect(db.magic.scar.lock).toHaveBeenCalledWith(mockScars.slice(0, mockCount), mockUserId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        scars: mockScars.slice(0, mockCount)
      })
    })
  })

  describe('releaseByUser', () => {
    it('should release scars for a user and return success response', async () => {
      // Setup
      const mockUserId = '507f1f77bcf86cd799439011'
      req.body.userId = mockUserId
      
      db.magic.scar.releaseByUser.mockResolvedValueOnce()
      
      // Execute
      await scarController.releaseByUser(req, res)
      
      // Verify
      expect(db.magic.scar.releaseByUser).toHaveBeenCalledWith(mockUserId)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
    })
  })

  describe('save', () => {
    it('should save a scar and return success response', async () => {
      // Setup
      const mockScar = { name: 'Test Scar', description: 'Test Description' }
      const mockSavedScar = { _id: '507f1f77bcf86cd799439011', ...mockScar }
      
      req.body.scar = mockScar
      db.magic.scar.save.mockResolvedValueOnce(mockSavedScar)
      
      // Execute
      await scarController.save(req, res)
      
      // Verify
      expect(db.magic.scar.save).toHaveBeenCalledWith(mockScar)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        scar: mockSavedScar
      })
    })
  })
}) 

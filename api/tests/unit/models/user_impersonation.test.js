import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ObjectId } from 'mongodb'

// Mock the MongoDB module
vi.mock('../../../src/utils/mongo.js', () => {
  const findOneSpy = vi.fn()
  const updateOneSpy = vi.fn().mockResolvedValue({ modifiedCount: 1 })

  const mockExports = {
    findOne: findOneSpy,
    updateOne: updateOneSpy
  }

  return {
    client: {
      db: vi.fn().mockReturnValue({
        collection: vi.fn().mockReturnValue({
          findOne: findOneSpy,
          updateOne: updateOneSpy
        })
      })
    },
    __mocks__: mockExports,
    default: {
      client: {
        db: vi.fn().mockReturnValue({
          collection: vi.fn().mockReturnValue({
            findOne: findOneSpy,
            updateOne: updateOneSpy
          })
        })
      },
      __mocks__: mockExports
    }
  }
})

// Import the modules after the mocks
import User from '../../../src/models/user_models.js'
import * as mongodb from '../../../src/utils/mongo.js'

describe('User Impersonation Model', () => {
  const adminId = new ObjectId()
  const targetUserId = new ObjectId()
  const adminUser = {
    _id: adminId,
    name: 'dennis',
    slack: 'dennis_slack'
  }
  const targetUser = {
    _id: targetUserId,
    name: 'testuser',
    slack: 'testuser_slack',
    deactivated: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('startImpersonation()', () => {
    it('should start impersonation successfully', async () => {
      // Mock admin user lookup
      mongodb.__mocks__.findOne
        .mockResolvedValueOnce(adminUser) // First call for admin
        .mockResolvedValueOnce(targetUser) // Second call for target user

      // Mock updateOne for setting impersonation data
      mongodb.__mocks__.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

      const result = await User.startImpersonation(adminId, targetUserId)

      expect(result).toHaveProperty('impersonationToken')
      expect(result).toHaveProperty('targetUser')
      expect(result).toHaveProperty('adminUser')
      expect(result.targetUser).toEqual({
        _id: targetUser._id,
        name: targetUser.name,
        slack: targetUser.slack
      })
      expect(result.adminUser).toEqual({
        _id: adminUser._id,
        name: adminUser.name
      })

      // Verify database calls
      expect(mongodb.__mocks__.findOne).toHaveBeenCalledTimes(2)
      expect(mongodb.__mocks__.updateOne).toHaveBeenCalledTimes(1)
    })

    it('should throw error if admin user not found', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(null) // Admin not found

      await expect(User.startImpersonation(adminId, targetUserId))
        .rejects.toThrow('Admin user not found')
    })

    it('should throw error if target user not found', async () => {
      mongodb.__mocks__.findOne
        .mockResolvedValueOnce(adminUser) // Admin found
        .mockResolvedValueOnce(null) // Target user not found

      await expect(User.startImpersonation(adminId, targetUserId))
        .rejects.toThrow('Target user not found')
    })

    it('should throw error if target user is deactivated', async () => {
      const deactivatedUser = { ...targetUser, deactivated: true }
      mongodb.__mocks__.findOne
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(deactivatedUser)

      await expect(User.startImpersonation(adminId, targetUserId))
        .rejects.toThrow('Cannot impersonate deactivated user')
    })

    it('should throw error if admin is not authorized', async () => {
      const nonAdminUser = { ...adminUser, name: 'notadmin' }
      mongodb.__mocks__.findOne
        .mockResolvedValueOnce(nonAdminUser)
        .mockResolvedValueOnce(targetUser)

      await expect(User.startImpersonation(adminId, targetUserId))
        .rejects.toThrow('Only admin users can impersonate')
    })

    it('should throw error if user is already being impersonated', async () => {
      const alreadyImpersonatedUser = {
        ...targetUser,
        impersonatedBy: new ObjectId()
      }
      mongodb.__mocks__.findOne
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce(alreadyImpersonatedUser)

      await expect(User.startImpersonation(adminId, targetUserId))
        .rejects.toThrow('User is already being impersonated')
    })
  })

  describe('stopImpersonation()', () => {
    it('should stop impersonation successfully', async () => {
      const impersonationToken = 'test-token'
      const userWithImpersonation = {
        ...targetUser,
        impersonatedBy: adminId,
        impersonationToken,
        originalAdminId: adminId
      }

      mongodb.__mocks__.findOne.mockResolvedValueOnce(userWithImpersonation)
      mongodb.__mocks__.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

      const result = await User.stopImpersonation(impersonationToken)

      expect(result).toEqual({
        message: 'Impersonation stopped successfully',
        originalAdminId: adminId
      })

      expect(mongodb.__mocks__.findOne).toHaveBeenCalledWith({ impersonationToken })
      expect(mongodb.__mocks__.updateOne).toHaveBeenCalledWith(
        { _id: targetUserId },
        { $unset: {
          impersonatedBy: 1,
          impersonationToken: 1,
          originalAdminId: 1,
          impersonationStartTime: 1
        }}
      )
    })

    it('should throw error if impersonation token is invalid', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(null)

      await expect(User.stopImpersonation('invalid-token'))
        .rejects.toThrow('Invalid impersonation token')
    })
  })

  describe('findByImpersonationToken()', () => {
    it('should find user by impersonation token', async () => {
      const impersonationToken = 'test-token'
      const userWithImpersonation = {
        ...targetUser,
        impersonationToken
      }

      mongodb.__mocks__.findOne.mockResolvedValueOnce(userWithImpersonation)

      const result = await User.findByImpersonationToken(impersonationToken)

      expect(result).toEqual(userWithImpersonation)
      expect(mongodb.__mocks__.findOne).toHaveBeenCalledWith({ impersonationToken })
    })
  })

  describe('getImpersonationStatus()', () => {
    it('should return impersonation status when user is being impersonated', async () => {
      const userWithImpersonation = {
        ...targetUser,
        impersonatedBy: adminId,
        impersonationStartTime: new Date()
      }

      mongodb.__mocks__.findOne
        .mockResolvedValueOnce(userWithImpersonation) // First call for user
        .mockResolvedValueOnce(adminUser) // Second call for admin user

      const result = await User.getImpersonationStatus(targetUserId)

      expect(result).toEqual({
        isImpersonated: true,
        impersonatedBy: {
          _id: adminUser._id,
          name: adminUser.name
        },
        impersonationStartTime: userWithImpersonation.impersonationStartTime
      })
    })

    it('should return not impersonated status when user is not being impersonated', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(targetUser)

      const result = await User.getImpersonationStatus(targetUserId)

      expect(result).toEqual({
        isImpersonated: false
      })
    })

    it('should return null if user not found', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(null)

      const result = await User.getImpersonationStatus(targetUserId)

      expect(result).toBeNull()
    })
  })

  describe('isAdmin()', () => {
    it('should return true for admin user', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(adminUser)

      const result = await User.isAdmin(adminId)

      expect(result).toBe(true)
    })

    it('should return false for non-admin user', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(targetUser)

      const result = await User.isAdmin(targetUserId)

      expect(result).toBe(false)
    })

    it('should return false if user not found', async () => {
      mongodb.__mocks__.findOne.mockResolvedValueOnce(null)

      const result = await User.isAdmin(targetUserId)

      expect(result).toBe(false)
    })
  })

  describe('generateImpersonationToken()', () => {
    it('should generate a valid impersonation token', () => {
      const token = User.util.generateImpersonationToken(adminId, targetUserId)

      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should handle ObjectId inputs', () => {
      const token = User.util.generateImpersonationToken(adminId, targetUserId)

      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ObjectId } from 'mongodb'

// Mock the database
vi.mock('../../../src/models/db.js', () => ({
  default: {
    user: {
      findById: vi.fn(),
      getImpersonationStatus: vi.fn()
    }
  }
}))

// Mock passport
vi.mock('passport', () => ({
  default: {
    use: vi.fn(),
    authenticate: vi.fn()
  }
}))

// Import after mocks
import db from '../../../src/models/db.js'

describe('Authentication Middleware - Impersonation', () => {
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
    slack: 'testuser_slack'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('JWT Strategy with impersonation', () => {

    beforeEach(() => {
    // Reset the module to get fresh instances
      vi.resetModules()
    })

    it('should authenticate regular user without impersonation', async () => {
      const tokenData = { user_id: targetUserId.toString() }

      db.user.findById.mockResolvedValueOnce(targetUser)

      // Mock the callback function
      const mockCallback = vi.fn()

      // Simulate the JWT strategy function
      const strategyFunction = async (tokenData, cb) => {
        const id = new ObjectId(tokenData.user_id)
        const user = await db.user.findById(id)

        if (!user) {
          return cb(null, false)
        }

        // Check if this is an impersonation token
        if (tokenData.impersonation) {
          // Verify the impersonation is still active
          const impersonationStatus = await db.user.getImpersonationStatus(user._id)
          if (!impersonationStatus || !impersonationStatus.isImpersonated) {
            return cb(null, false)
          }

          // Add impersonation metadata to the user object
          user._impersonation = {
            isImpersonated: true,
            adminId: tokenData.admin_id,
            impersonationToken: true
          }
        }

        return cb(null, user)
      }

      await strategyFunction(tokenData, mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null, targetUser)
      expect(db.user.findById).toHaveBeenCalledWith(targetUserId)
    })

    it('should authenticate user with valid impersonation token', async () => {
      const tokenData = {
        user_id: targetUserId.toString(),
        impersonation: true,
        admin_id: adminId.toString()
      }

      db.user.findById.mockResolvedValueOnce(targetUser)
      db.user.getImpersonationStatus.mockResolvedValueOnce({
        isImpersonated: true,
        impersonatedBy: {
          _id: adminId,
          name: adminUser.name
        }
      })

      const mockCallback = vi.fn()

      const strategyFunction = async (tokenData, cb) => {
        const id = new ObjectId(tokenData.user_id)
        const user = await db.user.findById(id)

        if (!user) {
          return cb(null, false)
        }

        // Check if this is an impersonation token
        if (tokenData.impersonation) {
          // Verify the impersonation is still active
          const impersonationStatus = await db.user.getImpersonationStatus(user._id)
          if (!impersonationStatus || !impersonationStatus.isImpersonated) {
            return cb(null, false)
          }

          // Add impersonation metadata to the user object
          user._impersonation = {
            isImpersonated: true,
            adminId: tokenData.admin_id,
            impersonationToken: true
          }
        }

        return cb(null, user)
      }

      await strategyFunction(tokenData, mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
        ...targetUser,
        _impersonation: {
          isImpersonated: true,
          adminId: adminId.toString(),
          impersonationToken: true
        }
      }))
      expect(db.user.findById).toHaveBeenCalledWith(targetUserId)
      expect(db.user.getImpersonationStatus).toHaveBeenCalledWith(targetUserId)
    })

    it('should reject impersonation token if impersonation is no longer active', async () => {
      const tokenData = {
        user_id: targetUserId.toString(),
        impersonation: true,
        admin_id: adminId.toString()
      }

      db.user.findById.mockResolvedValueOnce(targetUser)
      db.user.getImpersonationStatus.mockResolvedValueOnce({
        isImpersonated: false
      })

      const mockCallback = vi.fn()

      const strategyFunction = async (tokenData, cb) => {
        const id = new ObjectId(tokenData.user_id)
        const user = await db.user.findById(id)

        if (!user) {
          return cb(null, false)
        }

        // Check if this is an impersonation token
        if (tokenData.impersonation) {
          // Verify the impersonation is still active
          const impersonationStatus = await db.user.getImpersonationStatus(user._id)
          if (!impersonationStatus || !impersonationStatus.isImpersonated) {
            return cb(null, false)
          }

          // Add impersonation metadata to the user object
          user._impersonation = {
            isImpersonated: true,
            adminId: tokenData.admin_id,
            impersonationToken: true
          }
        }

        return cb(null, user)
      }

      await strategyFunction(tokenData, mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null, false)
      expect(db.user.findById).toHaveBeenCalledWith(targetUserId)
      expect(db.user.getImpersonationStatus).toHaveBeenCalledWith(targetUserId)
    })

    it('should reject impersonation token if user not found', async () => {
      const tokenData = {
        user_id: targetUserId.toString(),
        impersonation: true,
        admin_id: adminId.toString()
      }

      db.user.findById.mockResolvedValueOnce(null)

      const mockCallback = vi.fn()

      const strategyFunction = async (tokenData, cb) => {
        const id = new ObjectId(tokenData.user_id)
        const user = await db.user.findById(id)

        if (!user) {
          return cb(null, false)
        }

        // Check if this is an impersonation token
        if (tokenData.impersonation) {
          // Verify the impersonation is still active
          const impersonationStatus = await db.user.getImpersonationStatus(user._id)
          if (!impersonationStatus || !impersonationStatus.isImpersonated) {
            return cb(null, false)
          }

          // Add impersonation metadata to the user object
          user._impersonation = {
            isImpersonated: true,
            adminId: tokenData.admin_id,
            impersonationToken: true
          }
        }

        return cb(null, user)
      }

      await strategyFunction(tokenData, mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null, false)
      expect(db.user.findById).toHaveBeenCalledWith(targetUserId)
    })

    it('should handle impersonation status check errors gracefully', async () => {
      const tokenData = {
        user_id: targetUserId.toString(),
        impersonation: true,
        admin_id: adminId.toString()
      }

      db.user.findById.mockResolvedValueOnce(targetUser)
      db.user.getImpersonationStatus.mockRejectedValueOnce(new Error('Database error'))

      const mockCallback = vi.fn()

      const strategyFunction = async (tokenData, cb) => {
        const id = new ObjectId(tokenData.user_id)
        const user = await db.user.findById(id)

        if (!user) {
          return cb(null, false)
        }

        // Check if this is an impersonation token
        if (tokenData.impersonation) {
          try {
            // Verify the impersonation is still active
            const impersonationStatus = await db.user.getImpersonationStatus(user._id)
            if (!impersonationStatus || !impersonationStatus.isImpersonated) {
              return cb(null, false)
            }

            // Add impersonation metadata to the user object
            user._impersonation = {
              isImpersonated: true,
              adminId: tokenData.admin_id,
              impersonationToken: true
            }
          }
          catch {
            return cb(null, false)
          }
        }

        return cb(null, user)
      }

      await strategyFunction(tokenData, mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null, false)
      expect(db.user.findById).toHaveBeenCalledWith(targetUserId)
      expect(db.user.getImpersonationStatus).toHaveBeenCalledWith(targetUserId)
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

// Mock the database
vi.mock('../../src/models/db.js', async () => {
  const dbMock = await import('../mocks/db.mock.js')
  return { default: dbMock.default }
})

// Mock passport
vi.mock('passport', async () => {
  const passportMock = await import('../mocks/passport.mock.js')
  return { default: passportMock.default }
})

// Mock version.js
vi.mock('../../src/version.js', () => {
  return { default: 1747165976913 }
})

// Mock logger
vi.mock('../../src/utils/logger.js', async () => {
  const loggerMock = await import('../mocks/logger.mock.js')
  return { default: loggerMock.default }
})

import { app } from '../../server.js'
import db from '../../src/models/db.js'

describe('Impersonation API', () => {
  let adminUser
  let targetUser
  let adminToken

  beforeEach(async () => {
    // Create admin user
    const adminId = new ObjectId()
    adminUser = {
      _id: adminId,
      name: 'dennis',
      slack: 'dennis_slack',
      token: 'admin-token'
    }

    // Create target user
    const targetId = new ObjectId()
    targetUser = {
      _id: targetId,
      name: 'testuser',
      slack: 'testuser_slack',
      deactivated: false
    }

    // Create admin token
    adminToken = jwt.sign(
      { user_id: adminUser._id },
      process.env.SECRET_KEY || 'test-secret-key',
      { expiresIn: '1h' }
    )

    // Setup mocks
    db.user.findById.mockImplementation((id) => {
      if (id.toString() === adminUser._id.toString()) {
        return Promise.resolve(adminUser)
      }
      if (id.toString() === targetUser._id.toString()) {
        return Promise.resolve(targetUser)
      }
      return Promise.resolve(null)
    })

    db.user.startImpersonation.mockResolvedValue({
      impersonationToken: 'impersonation-token',
      targetUser: {
        _id: targetUser._id,
        name: targetUser.name,
        slack: targetUser.slack
      },
      adminUser: {
        _id: adminUser._id,
        name: adminUser.name
      }
    })

    db.user.stopImpersonation.mockResolvedValue({
      message: 'Impersonation stopped successfully',
      originalAdminId: adminUser._id
    })

    // Don't set a default mock for getImpersonationStatus - let individual tests set it
  })

  describe('POST /api/admin/impersonate', () => {
    it('should start impersonation successfully', async () => {
      const response = await request(app)
        .post('/api/admin/impersonate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          targetUserId: targetUser._id,
          appVersion: 1747165976913
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body).toHaveProperty('impersonationToken')
      expect(response.body).toHaveProperty('targetUser')
      expect(response.body).toHaveProperty('adminUser')
      expect(response.body.targetUser._id).toBe(targetUser._id.toString())
      expect(response.body.adminUser._id).toBe(adminUser._id.toString())

      expect(db.user.startImpersonation).toHaveBeenCalledWith(adminUser._id, targetUser._id)
    })

    it('should return 400 if targetUserId is missing', async () => {
      const response = await request(app)
        .post('/api/admin/impersonate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          appVersion: 1747165976913
        })

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('targetUserId is required')
    })

    it('should return 400 if impersonation fails', async () => {
      db.user.startImpersonation.mockRejectedValueOnce(new Error('Target user not found'))

      const response = await request(app)
        .post('/api/admin/impersonate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          targetUserId: targetUser._id,
          appVersion: 1747165976913
        })

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('Target user not found')
    })

    it('should return 403 for non-admin users', async () => {
      const nonAdminToken = jwt.sign(
        { user_id: targetUser._id },
        process.env.SECRET_KEY || 'test-secret-key',
        { expiresIn: '1h' }
      )

      const response = await request(app)
        .post('/api/admin/impersonate')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({
          targetUserId: targetUser._id,
          appVersion: 1747165976913
        })

      expect(response.status).toBe(403)
    })
  })

  describe('POST /api/admin/stop-impersonation', () => {
    it('should stop impersonation successfully', async () => {
      const response = await request(app)
        .post('/api/admin/stop-impersonation')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          impersonationToken: 'impersonation-token',
          appVersion: 1747165976913
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.message).toBe('Impersonation stopped successfully')
      expect(response.body.originalAdminId).toBe(adminUser._id.toString())

      expect(db.user.stopImpersonation).toHaveBeenCalledWith('impersonation-token')
    })

    it('should return 400 if impersonationToken is missing', async () => {
      const response = await request(app)
        .post('/api/admin/stop-impersonation')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          appVersion: 1747165976913
        })

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('impersonationToken is required')
    })

    it('should return 400 if stop impersonation fails', async () => {
      db.user.stopImpersonation.mockRejectedValueOnce(new Error('Invalid impersonation token'))

      const response = await request(app)
        .post('/api/admin/stop-impersonation')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          impersonationToken: 'invalid-token',
          appVersion: 1747165976913
        })

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('Invalid impersonation token')
    })
  })

  describe('GET /api/admin/impersonation-status', () => {
    it('should return impersonation status successfully', async () => {
      db.user.getImpersonationStatus.mockResolvedValueOnce({
        isImpersonated: true,
        impersonatedBy: {
          _id: adminUser._id,
          name: adminUser.name
        },
        impersonationStartTime: new Date()
      })

      const response = await request(app)
        .get('/api/admin/impersonation-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ appVersion: 1747165976913 })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.isImpersonated).toBe(true)
      expect(response.body.impersonatedBy).toBeDefined()

      expect(db.user.getImpersonationStatus).toHaveBeenCalledWith(adminUser._id)
    })

    it('should return not impersonated status', async () => {
      db.user.getImpersonationStatus.mockResolvedValueOnce({
        isImpersonated: false
      })

      const response = await request(app)
        .get('/api/admin/impersonation-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ appVersion: 1747165976913 })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.isImpersonated).toBe(false)
    })

    it('should return 404 if user not found', async () => {
      db.user.getImpersonationStatus.mockResolvedValueOnce(null)

      const response = await request(app)
        .get('/api/admin/impersonation-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ appVersion: 1747165976913 })

      expect(response.status).toBe(404)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('User not found')
    })

    it('should return 500 if internal error occurs', async () => {
      db.user.getImpersonationStatus.mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .get('/api/admin/impersonation-status')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ appVersion: 1747165976913 })

      expect(response.status).toBe(500)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('Internal server error')
    })
  })

  describe('Authentication with impersonation tokens', () => {
    it('should authenticate with valid impersonation token', async () => {
      const impersonationToken = jwt.sign(
        {
          user_id: targetUser._id,
          impersonation: true,
          admin_id: adminUser._id
        },
        process.env.SECRET_KEY || 'test-secret-key',
        { expiresIn: '1h' }
      )

      // Mock the user with impersonation data
      const userWithImpersonation = {
        ...targetUser,
        impersonatedBy: adminUser._id,
        impersonationToken
      }

      // Clear the global mock and set up specific mocks for this test
      db.user.findById.mockReset()
      db.user.findById.mockImplementation((id) => {
        if (id.toString() === targetUser._id.toString()) {
          return Promise.resolve(userWithImpersonation)
        }
        if (id.toString() === adminUser._id.toString()) {
          return Promise.resolve(adminUser)
        }
        return Promise.resolve(null)
      })

      db.user.getImpersonationStatus.mockClear()
      db.user.getImpersonationStatus.mockResolvedValue({
        isImpersonated: true,
        impersonatedBy: {
          _id: adminUser._id,
          name: adminUser.name
        }
      })

      const response = await request(app)
        .get('/api/admin/impersonation-status')
        .set('Authorization', `Bearer ${impersonationToken}`)
        .query({ appVersion: 1747165976913 })

      expect(response.status).toBe(200)
      expect(response.body.isImpersonated).toBe(true)
    })

    it('should reject expired impersonation token', async () => {
      const expiredToken = jwt.sign(
        {
          user_id: targetUser._id,
          impersonation: true,
          admin_id: adminUser._id,
          exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
        },
        process.env.SECRET_KEY || 'test-secret-key'
      )

      const response = await request(app)
        .get('/api/admin/impersonation-status')
        .set('Authorization', `Bearer ${expiredToken}`)
        .query({ appVersion: 1747165976913 })

      expect(response.status).toBe(401)
    })
  })
})

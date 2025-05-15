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

import { app } from '../../server.js'
import db from '../../src/models/db.js'

describe('Authentication', () => {
  let testUser

  beforeEach(async () => {
    // Create a test user with a valid ObjectId format
    const validObjectId = new ObjectId()
    testUser = await db.user.create({
      name: 'testuser',
      email: 'test@example.com'
    })

    // Override the _id with a valid ObjectId string
    testUser._id = validObjectId.toString()

    // Make sure the mock returns the test user with a valid ID
    db.user.findById.mockResolvedValue(testUser)
  })

  describe('POST /api/guest/login', () => {
    it('should return a user object when valid credentials are provided', async () => {
      // Setup the checkPassword mock to return our test user
      db.user.checkPassword.mockResolvedValueOnce(testUser)

      const response = await request(app)
        .post('/api/guest/login')
        .send({
          username: 'testuser',
          password: 'password',
          appVersion: 1747165976913
        })

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('user')
    })

    it('should reject invalid credentials', async () => {
      // Setup checkPassword to return null for invalid credentials
      db.user.checkPassword.mockResolvedValueOnce(null)

      const response = await request(app)
        .post('/api/guest/login')
        .send({
          username: 'testuser',
          password: 'wrong_password',
          appVersion: 1747165976913
        })

      expect(response.status).toEqual(401)
    })
  })

  describe('Authentication middleware', () => {
    it('should allow access to protected routes with valid token', async () => {
      // Create a valid token
      const token = jwt.sign(
        { user_id: testUser._id },
        process.env.SECRET_KEY || 'test-secret-key',
        { expiresIn: '1h' }
      )

      // Setup the findByIds mock to return our test user
      db.user.findByIds.mockReturnValueOnce({
        toArray: vi.fn().mockResolvedValueOnce([testUser])
      })

      const response = await request(app)
        .post('/api/user/fetch_many')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userIds: [testUser._id],
          appVersion: 1747165976913
        })

      expect(response.status).toEqual(200)

      const serializedUser = {
        ...testUser,
        _id: testUser._id,
      }
      expect(response.body.users).toEqual([serializedUser])
    })

    it('should reject access to protected routes without token', async () => {
      const response = await request(app)
        .post('/api/user/fetch_many')
        .send({
          userIds: [testUser._id],
          appVersion: 1747165976913
        })

      expect(response.status).toEqual(401)
    })
  })
})

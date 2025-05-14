const request = require('supertest')
const jwt = require('jsonwebtoken')

// Mock the database
jest.mock('../../src/models/db', () => require('../mocks/db.mock.js'))

// Mock passport
jest.mock('passport', () => require('../mocks/passport.mock.js'))

const { app } = require('../../src/server.js')
const db = require('../../src/models/db.js')

describe('Authentication', () => {
  let testUser

  beforeEach(async () => {
    // Create a test user
    testUser = await db.user.create({
      name: 'testuser',
      email: 'test@example.com'
    })
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
          appVersion: '1.0'
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
          appVersion: '1.0'
        })

      expect(response.status).toEqual(401)
    })
  })

  describe('Authentication middleware', () => {
    it('should allow access to protected routes with valid token', async () => {
      // Create a valid token
      const token = jwt.sign(
        { user_id: testUser._id.toString() },
        process.env.SECRET_KEY || 'test-secret-key',
        { expiresIn: '1h' }
      )

      const response = await request(app)
        .post('/api/user/fetch_many')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userIds: [testUser._id.toString()],  // Use string format consistently
          appVersion: '1.0'
        })

      expect(response.status).toEqual(200)

      const serializedUser = {
        ...testUser,
        _id: testUser._id.toString(),
      }
      expect(response.body.users).toEqual([serializedUser])
    })

    it('should reject access to protected routes without token', async () => {
      const response = await request(app)
        .post('/api/user/fetch_many')
        .send({
          userIds: [testUser._id.toString()],
          appVersion: '1.0'
        })

      expect(response.status).toEqual(401)
    })
  })
})

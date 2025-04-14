const request = require('supertest')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')

// Mock the database
jest.mock('../../src/models/db', () => require('../mocks/db.mock'))

// Mock passport
jest.mock('passport', () => require('../mocks/passport.mock'))

const { app } = require('../../server')
const db = require('../../src/models/db')

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
    it('should return a token when valid credentials are provided', async () => {
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
      expect(response.body).toHaveProperty('token')
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

      // Mock the user find function
      db.user.findById.mockResolvedValueOnce(testUser)

      const response = await request(app)
        .post('/api/user/fetch_many')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userIds: [testUser._id],
          appVersion: '1.0'
        })
      
      expect(response.status).not.toEqual(401)
    })

    it('should reject access to protected routes without token', async () => {
      const response = await request(app)
        .post('/api/user/fetch_many')
        .send({
          userIds: [testUser._id],
          appVersion: '1.0'
        })
      
      expect(response.status).toEqual(401)
    })
  })
}) 

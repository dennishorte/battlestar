// Mock passport-jwt
jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(function JwtStrategy(options, verify) {
    // Store options and verify for testing
    this.options = options
    this.verify = verify
    return this
  }),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(() => 'token')
  }
}))

// Mock the mongo utility before requiring any modules that use it
jest.mock('../../../src/utils/mongo.js', () => ({
  client: {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({})
    })
  }
}))

// Mock the database before requiring any modules that use it
jest.mock('../../../src/models/db', () => ({
  user: {
    findById: jest.fn()
  }
}))

// Mock passport
jest.mock('passport', () => ({
  authenticate: jest.fn().mockImplementation(() => {
    return jest.fn((req, res, next) => next())
  }),
  use: jest.fn()
}))

// Set environment variables needed for tests
process.env.SECRET_KEY = 'test-secret-key'

const { authenticate } = require('../../../src/middleware/auth')
const passport = require('passport')

describe('Authenticate Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      path: '/api/user/fetch_many',
      method: 'POST',
      headers: {}
    }
    res = {}
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should pass through requests to guest routes without authentication', () => {
    // Setup
    req.path = '/api/guest/login'
    
    // Execute
    authenticate(req, res, next)
    
    // Verify
    expect(passport.authenticate).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
  
  it('should pass through GET requests without authentication', () => {
    // Setup
    req.method = 'GET'
    
    // Execute
    authenticate(req, res, next)
    
    // Verify
    expect(passport.authenticate).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
  
  it('should apply JWT authentication to protected routes', () => {
    // Setup for a protected route
    req.path = '/api/user/fetch_many'
    req.method = 'POST'
    
    // Mock the passport.authenticate return value
    const mockAuthFn = jest.fn()
    passport.authenticate.mockReturnValueOnce(mockAuthFn)
    
    // Execute
    authenticate(req, res, next)
    
    // Verify
    expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false })
    expect(mockAuthFn).toHaveBeenCalledWith(req, res, next)
  })
  
  it('should handle authentication for routes with dynamic segments', () => {
    // Setup for a protected route with ID
    req.path = '/api/game/12345/save'
    req.method = 'POST'
    
    // Mock the passport.authenticate return value
    const mockAuthFn = jest.fn()
    passport.authenticate.mockReturnValueOnce(mockAuthFn)
    
    // Execute
    authenticate(req, res, next)
    
    // Verify
    expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false })
    expect(mockAuthFn).toHaveBeenCalledWith(req, res, next)
  })
}) 

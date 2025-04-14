// Mock passport first, before requiring the auth module
jest.mock('passport', () => ({
  authenticate: jest.fn(() => (req, res, next) => next()),
  use: jest.fn()
}));

// Mock passport-jwt
jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn()
  }
}));

// Now require the actual module
const { authenticate } = require('../../../src/middleware/auth');
const passport = require('passport');
const { ObjectId } = require('mongodb');

// Mock db
jest.mock('../../../src/models/db', () => ({
  user: {
    findById: jest.fn()
  }
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      path: '/api/user/fetch_many',
      method: 'POST',
      headers: {}
    };
    res = {};
    next = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    it('should pass through requests to guest routes without authentication', () => {
      // Setup
      req.path = '/api/guest/login';
      
      // Execute
      authenticate(req, res, next);
      
      // Verify
      expect(passport.authenticate).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    
    it('should pass through GET requests without authentication', () => {
      // Setup
      req.method = 'GET';
      
      // Execute
      authenticate(req, res, next);
      
      // Verify
      expect(passport.authenticate).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    
    it('should apply JWT authentication to protected routes', () => {
      // Setup for a protected route
      req.path = '/api/user/fetch_many';
      req.method = 'POST';
      
      // Execute
      authenticate(req, res, next);
      
      // Verify
      expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false });
    });
    
    it('should handle authentication for routes with dynamic segments', () => {
      // Setup for a protected route with ID
      req.path = '/api/game/12345/save';
      req.method = 'POST';
      
      // Execute
      authenticate(req, res, next);
      
      // Verify
      expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false });
    });
  });
}); 
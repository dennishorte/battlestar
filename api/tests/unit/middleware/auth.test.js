import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock passport first, before requiring the auth module
vi.mock('passport', () => {
  return {
    default: {
      authenticate: vi.fn(() => (req, res, next) => next()),
      use: vi.fn()
    }
  }
})

// Mock passport-jwt
vi.mock('passport-jwt', () => {
  return {
    Strategy: vi.fn(),
    ExtractJwt: {
      fromAuthHeaderAsBearerToken: vi.fn()
    }
  }
})

// Now import the actual module
import { authenticate } from '../../../src/middleware/auth.js'
import passport from 'passport'

// Mock db
vi.mock('../../../src/models/db', () => {
  return {
    default: {
      user: {
        findById: vi.fn()
      }
    }
  }
})

describe('Auth Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      path: '/api/user/fetch_many',
      method: 'POST',
      headers: {}
    }
    res = {}
    next = vi.fn()

    vi.clearAllMocks()
  })

  describe('authenticate middleware', () => {
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

      // Execute
      authenticate(req, res, next)

      // Verify
      expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false })
    })

    it('should handle authentication for routes with dynamic segments', () => {
      // Setup for a protected route with ID
      req.path = '/api/game/12345/save'
      req.method = 'POST'

      // Execute
      authenticate(req, res, next)

      // Verify
      expect(passport.authenticate).toHaveBeenCalledWith('jwt', { session: false })
    })
  })
})

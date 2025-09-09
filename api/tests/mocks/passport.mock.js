import { vi } from 'vitest'
import jwt from 'jsonwebtoken'

const passport = {}

// Mock authenticate method

passport.authenticate = vi.fn(() => {
  return async (req, res, next) => {
    // Check if token is present in the Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    // Extract token
    const token = authHeader.split(' ')[1]

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET_KEY || 'test-secret-key')

      // Find user by ID from token
      const userId = decoded.user_id

      // Get the mocked db instance from the test
      const db = await import('./db.mock.js').then(m => m.default)

      // Look up user in database
      const user = await db.user.findById(userId)

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        })
      }

      // Check if this is an impersonation token
      if (decoded.impersonation) {
        // Verify the impersonation is still active
        const impersonationStatus = await db.user.getImpersonationStatus(user._id)
        if (!impersonationStatus || !impersonationStatus.isImpersonated) {
          return res.status(401).json({
            status: 'error',
            message: 'Invalid impersonation token'
          })
        }

        // Add impersonation metadata to the user object
        user._impersonation = {
          isImpersonated: true,
          adminId: decoded.admin_id,
          impersonationToken: true
        }
      }

      // Set user in request object
      req.user = user
      next()
    }
    catch {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      })
    }
  }
})

passport.use = vi.fn()

export default passport

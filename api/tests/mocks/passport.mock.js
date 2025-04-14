const passport = require('passport')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')
const db = require('./db.mock')

// Mock authenticate method
passport.authenticate = jest.fn((strategy, options) => {
  return (req, res, next) => {
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
      
      // Set user in request object (in a real app, we'd look up the user in the database)
      req.user = { _id: userId, name: 'testuser' }
      next()
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      })
    }
  }
})

passport.use = jest.fn()

module.exports = passport 

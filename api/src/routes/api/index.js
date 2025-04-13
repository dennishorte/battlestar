const express = require('express')
const router = express.Router()

// Import all route files
const gameRouter = require('./game.router')
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
// Import other routers as they are created

// Guest routes (no authentication required)
router.use('/guest', authRouter)

// Routes that require authentication
router.use('/game', gameRouter)
router.use('/user', userRouter)
// Add other routers as they are created

module.exports = router; 
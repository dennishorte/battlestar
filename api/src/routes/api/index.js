const express = require('express')
const router = express.Router()

// Import all route files
const gameRouter = require('./game.router.js')
const authRouter = require('./auth.router.js')
const userRouter = require('./user.router.js')
const lobbyRouter = require('./lobby.router.js')
const miscRouter = require('./misc.router.js')
const tyrantsRouter = require('./tyrants')
const magicRouter = require('./magic')

// Guest routes (no authentication required)
router.use('/guest', authRouter)
router.use('/misc', miscRouter) // Version info doesn't need auth

// Routes that require authentication
router.use('/game', gameRouter)
router.use('/user', userRouter)
router.use('/lobby', lobbyRouter)
router.use('/tyrants', tyrantsRouter)
router.use('/magic', magicRouter)

module.exports = router

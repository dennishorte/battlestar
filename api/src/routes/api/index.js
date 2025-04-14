const express = require('express')
const router = express.Router()

// Import all route files
const gameRouter = require('./game.router')
const authRouter = require('./auth.router')
const userRouter = require('./user.router')
const lobbyRouter = require('./lobby.router')
const snapshotRouter = require('./snapshot.router')
const miscRouter = require('./misc.router')
const tyrantsRouter = require('./tyrants')

// Guest routes (no authentication required)
router.use('/guest', authRouter)
router.use('/misc', miscRouter) // Version info doesn't need auth

// Routes that require authentication
router.use('/game', gameRouter)
router.use('/user', userRouter)
router.use('/lobby', lobbyRouter)
router.use('/snapshot', snapshotRouter)
router.use('/tyrants', tyrantsRouter)

module.exports = router; 
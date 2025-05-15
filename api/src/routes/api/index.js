import express from 'express'
const router = express.Router()

// Import all route files
import gameRouter from './game.router.js'
import authRouter from './auth.router.js'
import userRouter from './user.router.js'
import lobbyRouter from './lobby.router.js'
import miscRouter from './misc.router.js'
import tyrantsRouter from './tyrants/index.js'
import magicRouter from './magic/index.js'

// Guest routes (no authentication required)
router.use('/guest', authRouter)
router.use('/misc', miscRouter) // Version info doesn't need auth

// Routes that require authentication
router.use('/game', gameRouter)
router.use('/user', userRouter)
router.use('/lobby', lobbyRouter)
router.use('/tyrants', tyrantsRouter)
router.use('/magic', magicRouter)

export default router

import express from 'express'
const router = express.Router()

// Import all route files
import adminRouter from './admin.router.js'
import authRouter from './auth.router.js'
import gameRouter from './game.router.js'
import lobbyRouter from './lobby.router.js'
import magicRouter from './magic/index.js'
import miscRouter from './misc.router.js'
import tyrantsRouter from './tyrants/index.js'
import userRouter from './user.router.js'

// Guest routes (no authentication required)
router.use('/guest', authRouter)

// Routes that require authentication
router.use('/game', gameRouter)
router.use('/user', userRouter)
router.use('/lobby', lobbyRouter)
router.use('/tyrants', tyrantsRouter)
router.use('/magic', magicRouter)
router.use('/misc', miscRouter)

// Admin-only routes
router.use('/admin', adminRouter)

export default router

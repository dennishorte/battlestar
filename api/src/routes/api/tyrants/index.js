import express from 'express'
const router = express.Router()
import hexRouter from './hex_router.js'

/**
 * Tyrants sub-routes
 */
router.use('/hex', hexRouter)

export default router

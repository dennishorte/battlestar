import express from 'express'
import cubeRouter from './cube_router.js'
import cardRouter from './card_router.js'
import deckRouter from './deck_router.js'
import scryfallRouter from './scryfall_router.js'
import linkRouter from './link_router.js'

/**
 * Magic sub-routes
 */
const router = express.Router()

router.use('/cube', cubeRouter)
router.use('/card', cardRouter)
router.use('/deck', deckRouter)
router.use('/scryfall', scryfallRouter)
router.use('/link', linkRouter)

// All magic routes have been migrated

export default router

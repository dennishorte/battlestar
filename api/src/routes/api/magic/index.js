import express from 'express'
import cubeRouter from './cube.router.js'
import cardRouter from './card.router.js'
import deckRouter from './deck.router.js'
import scryfallRouter from './scryfall.router.js'
import linkRouter from './link.router.js'

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

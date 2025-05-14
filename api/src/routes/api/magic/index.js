const express = require('express')
const router = express.Router()
const cubeRouter = require('./cube.router.js')
const cardRouter = require('./card.router.js')
const deckRouter = require('./deck.router.js')
const scryfallRouter = require('./scryfall.router.js')
const linkRouter = require('./link.router.js')

/**
 * Magic sub-routes
 */
router.use('/cube', cubeRouter)
router.use('/card', cardRouter)
router.use('/deck', deckRouter)
router.use('/scryfall', scryfallRouter)
router.use('/link', linkRouter)

// All magic routes have been migrated

module.exports = router

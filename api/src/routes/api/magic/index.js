const express = require('express')
const router = express.Router()
const fileRouter = require('./file.router')
const cubeRouter = require('./cube.router')
const cardRouter = require('./card.router')
const deckRouter = require('./deck.router')
const scryfallRouter = require('./scryfall.router')
const linkRouter = require('./link.router')

/**
 * Magic sub-routes
 */
router.use('/file', fileRouter)
router.use('/cube', cubeRouter)
router.use('/card', cardRouter)
router.use('/deck', deckRouter)
router.use('/scryfall', scryfallRouter)
router.use('/link', linkRouter)

// All magic routes have been migrated

module.exports = router 

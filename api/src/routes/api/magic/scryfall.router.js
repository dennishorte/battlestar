const express = require('express')
const router = express.Router()
const scryfallController = require('@controllers/magic/scryfall.controller')

/**
 * @route POST /api/magic/scryfall/update
 * @desc Update Scryfall data
 * @access Private
 */
router.post('/update', scryfallController.update)

module.exports = router

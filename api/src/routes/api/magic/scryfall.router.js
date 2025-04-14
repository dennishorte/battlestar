const express = require('express')
const router = express.Router()
const scryfallController = require('../../../controllers/magic/scryfall.controller')

/**
 * @route POST /api/magic/scryfall/update_all
 * @desc Update all Scryfall data
 * @access Private
 */
router.post('/update_all', scryfallController.updateAll)

module.exports = router 

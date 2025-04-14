const express = require('express')
const router = express.Router()
const cardController = require('../../../controllers/magic/card.controller')

/**
 * @route POST /api/magic/card/fetch_all
 * @desc Fetch all cards
 * @access Private
 */
router.post('/fetch_all', cardController.fetchAll)

/**
 * @route POST /api/magic/card/save
 * @desc Save a card
 * @access Private
 */
router.post('/save', cardController.save)

/**
 * @route POST /api/magic/card/versions
 * @desc Get card versions
 * @access Private
 */
router.post('/versions', cardController.versions)

module.exports = router 
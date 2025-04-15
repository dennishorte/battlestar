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
 * @route POST /api/magic/card/create
 * @desc Create a new card
 * @access Private
 */
router.post('/create', cardController.create)

/**
 * @route POST /api/magic/card/update
 * @desc Update an existing card
 * @access Private
 */
router.post('/update', cardController.update)

/**
 * @route POST /api/magic/card/versions
 * @desc Get card versions
 * @access Private
 */
router.post('/versions', cardController.versions)

module.exports = router 

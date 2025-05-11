const express = require('express')
const router = express.Router()
const deckController = require('@controllers/magic/deck.controller')

/**
 * @route POST /api/magic/deck/create
 * @desc Create a new deck
 * @access Private
 */
router.post('/create', deckController.create)

/**
 * @route POST /api/magic/deck/delete
 * @desc Delete a deck
 * @access Private
 */
router.post('/delete', deckController.delete)

/**
 * @route POST /api/magic/deck/duplicate
 * @desc Duplicate a deck
 * @access Private
 */
router.post('/duplicate', deckController.duplicate)

/**
 * @route POST /api/magic/deck/fetch
 * @desc Fetch a deck by ID
 * @access Private
 */
router.post('/fetch', deckController.fetch)

/**
 * @route POST /api/magic/deck/save
 * @desc Save changes to a deck
 * @access Private
 */
router.post('/save', deckController.save)

module.exports = router

import express from 'express'
const router = express.Router()
import * as deckController from '../../../controllers/magic/deck_controller.js'

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
router.post('/delete', deckController.deleteDeck)

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

export default router

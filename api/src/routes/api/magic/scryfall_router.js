import express from 'express'
const router = express.Router()
import * as scryfallController from '../../../controllers/magic/scryfall_controller.js'

/**
 * @route POST /api/magic/scryfall/update
 * @desc Kick off background Scryfall update (sets + cards)
 * @access Private
 */
router.post('/update', scryfallController.update)

/**
 * @route POST /api/magic/scryfall/update/status
 * @desc Poll current update job progress
 * @access Private
 */
router.post('/update/status', scryfallController.updateStatus)

export default router

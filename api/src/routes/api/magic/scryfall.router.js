import express from 'express'
const router = express.Router()
import * as scryfallController from '../../../controllers/magic/scryfall.controller.js'

/**
 * @route POST /api/magic/scryfall/update
 * @desc Update Scryfall data
 * @access Private
 */
router.post('/update', scryfallController.update)

export default router

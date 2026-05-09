import express from 'express'
const router = express.Router()
import * as setsController from '../../../controllers/magic/sets_controller.js'

/**
 * @route POST /api/magic/sets/all
 * @desc Fetch all magic sets
 * @access Private
 */
router.post('/all', setsController.fetchAll)

/**
 * @route POST /api/magic/sets/update
 * @desc Refresh magic sets from Scryfall
 * @access Private
 */
router.post('/update', setsController.update)

export default router

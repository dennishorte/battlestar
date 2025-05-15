import express from 'express'
const router = express.Router()
import * as cardController from '../../../controllers/magic/card.controller.js'

/**
 * @route POST /api/magic/card/all
 * @desc Fetch all cards
 * @access Private
 */
router.post('/all', cardController.fetchAll)

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

export default router

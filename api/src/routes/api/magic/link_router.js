import express from 'express'
const router = express.Router()
import * as linkController from '../../../controllers/magic/link_controller.js'

/**
 * @route POST /api/magic/link/create
 * @desc Create a link between a game and a draft
 * @access Private
 */
router.post('/create', linkController.create)

/**
 * @route POST /api/magic/link/fetch_drafts
 * @desc Fetch drafts associated with a user
 * @access Private
 */
router.post('/fetch_drafts', linkController.fetchDrafts)

/**
 * @route POST /api/magic/link/fetch_drafts_by_cube
 * @desc Fetch drafts associated with a cube
 * @access Private
 */
router.post('/fetch_drafts_by_cube', linkController.fetchDraftsByCube)

/**
 * @route POST /api/magic/link/fetch_by_draft
 * @desc Fetch games linked to a draft
 * @access Private
 */
router.post('/fetch_by_draft', linkController.fetchByDraft)

export default router

const express = require('express')
const router = express.Router()
const linkController = require('../../../controllers/magic/link.controller')
const { loadDraftArgs, loadGameArgs } = require('../../../middleware')

/**
 * @route POST /api/magic/link/create
 * @desc Create a link between a game and a draft
 * @access Private
 */
router.post('/create', loadDraftArgs, loadGameArgs, linkController.create)

/**
 * @route POST /api/magic/link/fetch_drafts
 * @desc Fetch drafts associated with a user
 * @access Private
 */
router.post('/fetch_drafts', linkController.fetchDrafts)

/**
 * @route POST /api/magic/link/fetch_by_draft
 * @desc Fetch games linked to a draft
 * @access Private
 */
router.post('/fetch_by_draft', loadDraftArgs, linkController.fetchByDraft)

module.exports = router 

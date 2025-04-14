const express = require('express')
const router = express.Router()
const snapshotController = require('../../controllers/snapshot.controller')

/**
 * @route POST /api/snapshot/create
 * @description Create a new snapshot from a game
 * @access Private
 * @body {String} gameId - ID of the game to snapshot
 */
router.post('/create', snapshotController.createSnapshot)

/**
 * @route POST /api/snapshot/fetch
 * @description Fetch snapshots for a specific game
 * @access Private
 * @body {String} gameId - ID of the game to fetch snapshots for
 */
router.post('/fetch', snapshotController.getSnapshots)

module.exports = router 
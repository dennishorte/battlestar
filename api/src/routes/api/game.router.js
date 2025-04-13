const express = require('express')
const router = express.Router()
const gameController = require('../../controllers/game.controller')

// Game Routes
router.post('/create', gameController.create)
router.post('/fetchAll', gameController.fetchAll)
router.post('/stats/innovation', gameController.stats.innovation)
router.post('/fetch', gameController.fetch)
router.post('/kill', gameController.kill)
router.post('/rematch', gameController.rematch)
router.post('/saveFull', gameController.saveFull)
router.post('/saveResponse', gameController.saveResponse)
router.post('/undo', gameController.undo)

module.exports = router; 
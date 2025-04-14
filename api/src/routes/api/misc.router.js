const express = require('express')
const router = express.Router()
const miscController = require('../../controllers/misc.controller')

/**
 * @route GET /api/misc/version
 * @description Get application version 
 * @access Public
 */
router.get('/version', miscController.getAppVersion)

module.exports = router 
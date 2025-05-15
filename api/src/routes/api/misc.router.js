import express from 'express'
const router = express.Router()
import * as miscController from '../../controllers/misc.controller.js'

/**
 * @route GET /api/misc/version
 * @description Get application version
 * @access Public
 */
router.post('/version', miscController.getAppVersion)

export default router

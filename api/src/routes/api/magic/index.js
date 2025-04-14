const express = require('express')
const router = express.Router()
const fileRouter = require('./file.router')
const cubeRouter = require('./cube.router')

/**
 * Magic sub-routes
 */
router.use('/file', fileRouter)
router.use('/cube', cubeRouter)

// More sub-routers will be added as they're migrated

module.exports = router 
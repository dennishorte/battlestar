const express = require('express')
const router = express.Router()
const hexRouter = require('./hex.router.js')

/**
 * Tyrants sub-routes
 */
router.use('/hex', hexRouter)

module.exports = router

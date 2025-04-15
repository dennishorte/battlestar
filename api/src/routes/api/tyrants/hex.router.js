const express = require('express')
const router = express.Router()
const hexController = require('../../../controllers/tyrants/hex.controller')

/**
 * @route POST /api/tyrants/hex/all
 * @description Get all hexes
 * @access Private
 */
router.post('/all', hexController.getAllHexes)

/**
 * @route POST /api/tyrants/hex/delete
 * @description Delete a hex
 * @access Private
 * @body {String} id - ID of the hex to delete
 */
router.post('/delete', hexController.deleteHex)

/**
 * @route POST /api/tyrants/hex/save
 * @description Save a hex
 * @access Private
 * @body {Object} hex - Hex data to save
 */
router.post('/save', hexController.saveHex)

module.exports = router 

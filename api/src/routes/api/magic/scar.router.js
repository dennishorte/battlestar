const express = require('express')
const router = express.Router()
const scarController = require('../../../controllers/magic/scar.controller')

/**
 * @route POST /api/magic/scar/apply
 * @desc Apply a scar to cards
 * @access Private
 */
router.post('/apply', scarController.apply)

/**
 * @route POST /api/magic/scar/fetch_all
 * @desc Fetch all scars for a cube
 * @access Private
 */
router.post('/fetch_all', scarController.fetchAll)

/**
 * @route POST /api/magic/scar/fetch_available
 * @desc Fetch available scars for a cube
 * @access Private
 */
router.post('/fetch_available', scarController.fetchAvailable)

/**
 * @route POST /api/magic/scar/release_by_user
 * @desc Release scars for a user
 * @access Private
 */
router.post('/release_by_user', scarController.releaseByUser)

/**
 * @route POST /api/magic/scar/save
 * @desc Save a scar
 * @access Private
 */
router.post('/save', scarController.save)

module.exports = router 

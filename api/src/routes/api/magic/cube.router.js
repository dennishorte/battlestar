const express = require('express')
const router = express.Router()
const cubeController = require('@controllers/magic/cube.controller')

/**
 * @route POST /api/magic/cube/all
 * @description Get all cubes
 * @access Private
 */
router.post('/all', cubeController.all)

router.post('/add_remove_cards', cubeController.addRemoveCards)

/**
 * @route POST /api/magic/cube/create
 * @description Create a new cube
 * @access Private
 * @body {Object} [data] - Cube creation data
 */
router.post('/create', cubeController.createCube)

/**
 * @route POST /api/magic/cube/fetch
 * @description Fetch a cube by ID
 * @access Private
 * @body {String} cubeId - ID of the cube to fetch
 */
router.post('/fetch', cubeController.getCube)

/**
 * @route POST /api/magic/cube/save
 * @description Save changes to a cube
 * @access Private
 * @body {Object} cube - Complete cube object with changes
 */
router.post('/save', cubeController.saveCube)

/**
 * @route POST /api/magic/cube/set_flag
 * @description Set the a flag for a cube
 * @access Private
 * @body {String} name - name of flag
 * @body {Boolean} value - new flag value
 */
router.post('/set_flag', cubeController.setFlag)

module.exports = router

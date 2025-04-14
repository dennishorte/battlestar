const express = require('express')
const router = express.Router()
const cubeController = require('../../../controllers/magic/cube.controller')

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
 * @route GET /api/magic/cube/fetchPublic
 * @description Get all public cubes
 * @access Public
 */
router.post('/fetchPublic', cubeController.getPublicCubes)

/**
 * @route POST /api/magic/cube/save
 * @description Save changes to a cube
 * @access Private
 * @body {Object} cube - Complete cube object with changes
 */
router.post('/save', cubeController.saveCube)

/**
 * @route POST /api/magic/cube/setEditFlag
 * @description Set the edit flag for a cube
 * @access Private
 * @body {Object} editFlag - Edit flag object
 */
router.post('/setEditFlag', cubeController.setEditFlag)

/**
 * @route POST /api/magic/cube/setPublicFlag
 * @description Set the public flag for a cube
 * @access Private
 * @body {Boolean} publicFlag - Public flag status
 */
router.post('/setPublicFlag', cubeController.setPublicFlag)

module.exports = router 

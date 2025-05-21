import express from 'express'
const router = express.Router()
import * as cubeController from '../../../controllers/magic/cube.controller.js'

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
 * @route POST /api/magic/cube/delete_achievement
 * @description Add or delete an achievement in the cube achievement list
 * @access Private
 * @body {String} cubeId - ID of the cube to delete into
   @body {Object} achievement - Achievement to be deleted
 */
router.post('/delete_achievement', cubeController.deleteAchievement)

/**
 * @route POST /api/magic/cube/delete_scar
 * @description Add or delete a scar in the cube scarlist
 * @access Private
 * @body {String} cubeId - ID of the cube to delete into
   @body {Object} scar - Scar to be deleted
 */
router.post('/delete_scar', cubeController.deleteScar)

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
 * @route POST /api/magic/cube/update_scar
 * @description Add or update a scar in the cube scarlist
 * @access Private
 * @body {String} cubeId - ID of the cube to update into
   @body {Object} scar - Scar to be added/updated
 */
router.post('/update_scar', cubeController.updateScar)

/**
 * @route POST /api/magic/cube/update_achievement
 * @description Add or update an achievement in the cube achievement list
 * @access Private
 * @body {String} cubeId - ID of the cube to update into
   @body {Object} achievement - Achievement to be added/updated
 */
router.post('/update_achievement', cubeController.updateAchievement)

/**
 * @route POST /api/magic/cube/update_settings
 * @description Update cube settings
 * @access Private
 * @body {String} cubeId - ID of the cube to update
 * @body {Object} settings - Settings to update (name, public, allowEdits)
 */
router.post('/update_settings', cubeController.updateSettings)

export default router

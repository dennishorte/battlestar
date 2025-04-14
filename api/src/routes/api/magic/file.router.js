const express = require('express')
const router = express.Router()
const fileController = require('../../../controllers/magic/file.controller')

/**
 * @route POST /api/magic/file/create
 * @description Create a new file
 * @access Private
 * @body {String} kind - Type of file (card, cube, or deck)
 * @body {Object} [data] - Additional creation data
 */
router.post('/create', fileController.createFile)

/**
 * @route POST /api/magic/file/delete
 * @description Delete a file
 * @access Private
 * @body {String} kind - Type of file (card, cube, or deck)
 * @body {String} fileId - ID of the file to delete
 */
router.post('/delete', fileController.deleteFile)

/**
 * @route POST /api/magic/file/duplicate
 * @description Duplicate a file
 * @access Private
 * @body {String} kind - Type of file (card, cube, or deck)
 * @body {String} fileId - ID of the file to duplicate
 */
router.post('/duplicate', fileController.duplicateFile)

/**
 * @route POST /api/magic/file/save
 * @description Save changes to a file
 * @access Private
 * @body {Object} file - Complete file object with changes (must include _id and kind)
 */
router.post('/save', fileController.saveFile)

module.exports = router 
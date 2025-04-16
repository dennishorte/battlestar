const express = require('express')
const router = express.Router()
const lobbyController = require('../../controllers/lobby.controller')

/**
 * @route POST /api/lobby/all
 * @description Get all lobbies
 * @access Private
 */
router.post('/all', lobbyController.getAllLobbies)

/**
 * @route POST /api/lobby/create
 * @description Create a new lobby
 * @access Private
 * @body {String} name - Name of the lobby
 * @body {String} game - Type of game (e.g., 'Innovation')
 * @body {Object} settings - Game specific settings
 */
router.post('/create', lobbyController.createLobby)

/**
 * @route POST /api/lobby/info
 * @description Get information about a specific lobby
 * @access Private
 * @middleware loadLobbyArgs - Loads the lobby into req.lobby based on req.body.lobbyId
 */
router.post('/info', lobbyController.getLobbyInfo)

/**
 * @route POST /api/lobby/kill
 * @description Delete a lobby
 * @access Private
 * @middleware loadLobbyArgs - Loads the lobby into req.lobby based on req.body.lobbyId
 */
router.post('/kill', lobbyController.killLobby)

/**
 * @route POST /api/lobby/save
 * @description Save changes to a lobby
 * @access Private
 * @body {Object} lobby - Complete lobby object with changes
 */
router.post('/save', lobbyController.saveLobby)

module.exports = router

const express = require('express')
const router = express.Router()
const lobbyController = require('../../controllers/lobby.controller')
const middleware = require('../../middleware')

/**
 * @route GET /api/lobby/all
 * @description Get all lobbies
 * @access Private
 */
router.get('/all', lobbyController.getAllLobbies)

/**
 * @route POST /api/lobby/create
 * @description Create a new lobby
 * @access Private
 * @body {Array} [userIds] - Optional array of user IDs to add to the lobby (defaults to current user)
 * @body {String} [game] - Optional game type for the lobby
 * @body {Object} [options] - Optional game options for the lobby
 */
router.post('/create', lobbyController.createLobby)

/**
 * @route POST /api/lobby/info
 * @description Get information about a specific lobby
 * @access Private
 * @middleware loadLobbyArgs - Loads the lobby into req.lobby based on req.body.lobbyId
 */
router.post('/info', middleware.loadLobbyArgs, lobbyController.getLobbyInfo)

/**
 * @route POST /api/lobby/kill
 * @description Delete a lobby
 * @access Private
 * @middleware loadLobbyArgs - Loads the lobby into req.lobby based on req.body.lobbyId
 */
router.post('/kill', middleware.loadLobbyArgs, lobbyController.killLobby)

/**
 * @route POST /api/lobby/save
 * @description Save changes to a lobby
 * @access Private
 * @body {Object} lobby - Complete lobby object with changes
 */
router.post('/save', lobbyController.saveLobby)

module.exports = router 
import express from 'express'
const router = express.Router()
import * as gameController from '../../controllers/game_controller.js'

/**
 * @swagger
 * /game/create:
 *   post:
 *     summary: Create a new game from a lobby
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lobbyId
 *             properties:
 *               lobbyId:
 *                 type: string
 *               linkedDraftId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 gameId:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lobby not found
 */
router.post('/create', gameController.create)

/**
 * @swagger
 * /game/fetchAll:
 *   post:
 *     summary: Fetch all games
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 games:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.post('/fetch_all', gameController.fetchAll)

/**
 * @swagger
 * /game/fetch:
 *   post:
 *     summary: Fetch a specific game by ID
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 game:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.post('/fetch', gameController.fetch)

/**
 * @swagger
 * /game/kill:
 *   post:
 *     summary: Kill (cancel) a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game killed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.post('/kill', gameController.kill)

/**
 * @swagger
 * /game/rematch:
 *   post:
 *     summary: Create a rematch from an existing game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rematch lobby created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 lobbyId:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.post('/rematch', gameController.rematch)

/**
 * @swagger
 * /game/saveFull:
 *   post:
 *     summary: Save full game state
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *               chat:
 *                 type: array
 *               responses:
 *                 type: array
 *               waiting:
 *                 type: array
 *               gameOver:
 *                 type: boolean
 *               gameOverData:
 *                 type: object
 *               branchId:
 *                 type: string
 *               overwrite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Game saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 serializedGame:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 *       409:
 *         description: Conflict (game overwrite or game killed)
 */
router.post('/save_full', gameController.saveFull)

/**
 * @swagger
 * /game/saveResponse:
 *   post:
 *     summary: Save a single game response
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - response
 *             properties:
 *               gameId:
 *                 type: string
 *               response:
 *                 type: object
 *     responses:
 *       200:
 *         description: Response saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 serializedGame:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.post('/save_response', gameController.saveResponse)

/**
 * @swagger
 * /game/undo:
 *   post:
 *     summary: Undo one or more game actions
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *             properties:
 *               gameId:
 *                 type: string
 *               count:
 *                 type: integer
 *                 description: Number of actions to undo
 *                 default: 1
 *     responses:
 *       200:
 *         description: Actions undone successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 serializedGame:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 */
router.post('/undo', gameController.undo)

/**
 * @swagger
 * /game/stats/innovation:
 *   post:
 *     summary: Get statistics for Innovation game
 *     tags: [Games, Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Innovation game statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.post('/stats/innovation', gameController.stats_innovation)

/**
 * @swagger
 * /game/stats/agricola:
 *   post:
 *     summary: Get statistics for Agricola game
 *     tags: [Games, Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agricola game statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.post('/stats/agricola', gameController.stats_agricola)

router.post('/notes/save', gameController.saveNotes)
router.post('/notes/fetch', gameController.fetchNotes)

router.post('/card-order/save', gameController.saveCardOrder)
router.post('/card-order/fetch', gameController.fetchCardOrder)

export default router

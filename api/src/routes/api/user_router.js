import express from 'express'
const router = express.Router()
import * as userController from '../../controllers/user_controller.js'

/**
 * @swagger
 * /user/all:
 *   post:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 */
router.post('/all', userController.getAllUsers)

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               slack:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/create', userController.createUser)

/**
 * @swagger
 * /user/deactivate:
 *   post:
 *     summary: Deactivate a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/all_deactivated', userController.getDeactivatedUsers)
router.post('/deactivate', userController.deactivateUser)
router.post('/reactivate', userController.reactivateUser)

/**
 * @swagger
 * /user/fetch_many:
 *   post:
 *     summary: Fetch multiple users by their IDs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/fetch_many', userController.fetchManyUsers)

/**
 * @swagger
 * /user/lobbies:
 *   post:
 *     summary: Get all lobbies for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of lobbies
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/lobbies', userController.getUserLobbies)

/**
 * @swagger
 * /user/games:
 *   post:
 *     summary: Get games for a user with optional filters
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: [all, active]
 *               kind:
 *                 type: string
 *               killed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: List of games
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/games', userController.getUserGames)

/**
 * @swagger
 * /user/games_recently_finished:
 *   post:
 *     summary: Get recently finished games for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of recently finished games
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/games_recently_finished', userController.getRecentlyFinishedGames)

/**
 * @swagger
 * /user/next:
 *   post:
 *     summary: Get the next game for a user that is waiting for their turn
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Next game ID waiting for user's turn
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/next', userController.getNextGame)

/**
 * @swagger
 * /user/update:
 *   post:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               name:
 *                 type: string
 *               slack:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/update', userController.updateUser)

// Magic related endpoints
/**
 * @swagger
 * /user/magic/cubes:
 *   post:
 *     summary: Get Magic cubes for a user
 *     tags: [Users, Magic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of Magic cubes
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/magic/cubes', userController.magic_getCubes)

/**
 * @swagger
 * /user/magic/decks:
 *   post:
 *     summary: Get Magic decks for a user
 *     tags: [Users, Magic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of Magic decks
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/magic/decks', userController.magic_getDecks)

/**
 * @swagger
 * /user/magic/files:
 *   post:
 *     summary: Get all Magic files (decks and cubes) for a user
 *     tags: [Users, Magic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of Magic files
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/magic/files', userController.magic_getFiles)

export default router

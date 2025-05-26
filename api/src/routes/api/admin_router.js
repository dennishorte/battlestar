import express from 'express'
const router = express.Router()
import { insert as insertGame } from '../../controllers/game_controller.js'

/**
 * Middleware to check user name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const checkUserName = (req, res, next) => {
  const authorizedName = 'dennis'

  if (req.user && req.user.name === authorizedName) {
    next() // Allow request to proceed
  }
  else {
    res.status(403).send('Access denied')
  }
}

// Apply middleware to all routes on this router
router.use(checkUserName)

/**
 * @swagger
 * /admin/insert_game:
 *   post:
 *     summary: Insert debug data from a game directly into the database
 *     description: This route allows an admin to insert debug data from a game directly into the database.
 *                  This is helpful when debugging a game in prod, allowing the game to be copied to a local
 *                  development environment.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Game data inserted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (not authorized admin)
 */
router.post('/insert_game', insertGame)

export default router

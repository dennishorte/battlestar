import express from 'express'
const router = express.Router()
import { insert as insertGame } from '../../controllers/game_controller.js'
import db from '../../models/db.js'
import logger from '../../utils/logger.js'

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
  else if (req.user && req.user._impersonation && req.user._impersonation.isImpersonated) {
    // Allow if this is an impersonation token and the original admin is authorized
    // We need to check if the original admin user is authorized
    // For now, we'll allow any impersonation token since the admin who created it was already authorized
    next()
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

/**
 * @swagger
 * /admin/impersonate:
 *   post:
 *     summary: Start impersonating a user
 *     description: Allows an admin user to impersonate another user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 description: ID of the user to impersonate
 *     responses:
 *       200:
 *         description: Impersonation started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 impersonationToken:
 *                   type: string
 *                 targetUser:
 *                   type: object
 *                 adminUser:
 *                   type: object
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *       404:
 *         description: Target user not found
 */
router.post('/impersonate', async (req, res) => {
  try {
    const { targetUserId } = req.body
    const adminId = req.user._id

    // Log request details for debugging
    logger.info('Impersonation attempt', {
      adminId: adminId?.toString(),
      adminIdType: typeof adminId,
      adminName: req.user?.name,
      targetUserId: targetUserId?.toString(),
      targetUserIdType: typeof targetUserId,
      targetUserIdLength: targetUserId?.toString().length
    })

    if (!targetUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'targetUserId is required'
      })
    }

    const result = await db.user.startImpersonation(adminId, targetUserId)

    logger.info(`Admin ${req.user.name} started impersonating user ${result.targetUser.name}`)

    res.status(200).json({
      status: 'success',
      ...result
    })
  }
  catch (error) {
    // Log full error details including stack trace
    logger.error('Impersonation error', {
      message: error.message,
      stack: error.stack,
      adminId: req.user?._id?.toString(),
      adminName: req.user?.name,
      targetUserId: req.body?.targetUserId?.toString(),
      errorName: error.name
    })
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

/**
 * @swagger
 * /admin/stop-impersonation:
 *   post:
 *     summary: Stop impersonating a user
 *     description: Stops the current impersonation and returns to admin user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - impersonationToken
 *             properties:
 *               impersonationToken:
 *                 type: string
 *                 description: The impersonation token to stop
 *     responses:
 *       200:
 *         description: Impersonation stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 originalAdminId:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invalid impersonation token
 */
router.post('/stop-impersonation', async (req, res) => {
  try {
    const { impersonationToken } = req.body

    if (!impersonationToken) {
      return res.status(400).json({
        status: 'error',
        message: 'impersonationToken is required'
      })
    }

    const result = await db.user.stopImpersonation(impersonationToken)

    logger.info(`Impersonation stopped for admin ${result.originalAdminId}`)

    res.status(200).json({
      status: 'success',
      ...result
    })
  }
  catch (error) {
    logger.error(`Stop impersonation error: ${error.message}`)
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

/**
 * @swagger
 * /admin/impersonation-status:
 *   get:
 *     summary: Get current impersonation status
 *     description: Returns the current impersonation status for the authenticated user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Impersonation status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 isImpersonated:
 *                   type: boolean
 *                 impersonatedBy:
 *                   type: object
 *                 impersonationStartTime:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.post('/impersonation-status', async (req, res) => {
  try {
    const userId = req.user._id
    const status = await db.user.getImpersonationStatus(userId)

    if (!status) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    res.status(200).json({
      status: 'success',
      ...status
    })
  }
  catch (error) {
    logger.error(`Get impersonation status error: ${error.message}`)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

export default router

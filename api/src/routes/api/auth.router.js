import express from 'express'
const router = express.Router()
import db from '#/models/db.js'
import logger from '#/utils/logger.js'

/**
 * @swagger
 * /guest/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               appVersion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    logger.debug(`Attempting login for user: ${username}`)

    const user = await db.user.checkPassword(username, password)

    if (!user) {
      logger.info(`Login failed for user: ${username}`)
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      })
    }

    logger.info(`User logged in successfully: ${username}`)

    // Return user info and token
    return res.status(200).json({
      status: 'success',
      user,
    })
  }
  catch (err) {
    logger.error(`Login error: ${err.message}`)
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    })
  }
})

export default router

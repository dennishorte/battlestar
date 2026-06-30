import express from 'express'
const router = express.Router()
import db from '../../models/db.js'
import logger from '../../utils/logger.js'

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

/**
 * @swagger
 * /guest/invite/validate:
 *   post:
 *     summary: Validate a registration invite token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Validation result
 */
router.post('/invite/validate', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ status: 'error', message: 'token is required' })
    }

    const invite = await db.invite.findByToken(token)
    if (!invite) {
      return res.status(200).json({ status: 'success', valid: false, reason: 'not_found' })
    }
    if (invite.usedAt) {
      return res.status(200).json({ status: 'success', valid: false, reason: 'used' })
    }
    if (invite.expiresAt < Date.now()) {
      return res.status(200).json({ status: 'success', valid: false, reason: 'expired' })
    }

    return res.status(200).json({
      status: 'success',
      valid: true,
      username: invite.username,
      expiresAt: invite.expiresAt,
    })
  }
  catch (err) {
    logger.error(`Invite validate error: ${err.message}`)
    return res.status(500).json({ status: 'error', message: 'Failed to validate invite' })
  }
})

/**
 * @swagger
 * /guest/invite/accept:
 *   post:
 *     summary: Accept an invite, set password, and create the user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created and logged in
 *       400:
 *         description: Bad request
 */
router.post('/invite/accept', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ status: 'error', message: 'token and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'password must be at least 8 characters' })
    }

    const invite = await db.invite.findByToken(token)
    if (!invite) {
      return res.status(400).json({ status: 'error', message: 'Invalid invite' })
    }
    if (invite.usedAt) {
      return res.status(400).json({ status: 'error', message: 'Invite has already been used' })
    }
    if (invite.expiresAt < Date.now()) {
      return res.status(400).json({ status: 'error', message: 'Invite has expired' })
    }

    let user
    try {
      user = await db.user.create({ name: invite.username, password })
    }
    catch (err) {
      return res.status(400).json({ status: 'error', message: err.toString() })
    }

    await db.invite.markUsed(token)

    logger.info(`User registered via invite: ${invite.username}`)

    return res.status(200).json({ status: 'success', user })
  }
  catch (err) {
    logger.error(`Invite accept error: ${err.message}`)
    return res.status(500).json({ status: 'error', message: 'Failed to accept invite' })
  }
})

router.post('/password-reset/validate', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ status: 'error', message: 'token is required' })
    }

    const user = await db.user.findByPasswordResetToken(token)
    if (!user) {
      return res.status(200).json({ status: 'success', valid: false, reason: 'not_found' })
    }
    if (user.passwordResetTokenExpiresAt < Date.now()) {
      return res.status(200).json({ status: 'success', valid: false, reason: 'expired' })
    }

    return res.status(200).json({
      status: 'success',
      valid: true,
      username: user.name,
      expiresAt: user.passwordResetTokenExpiresAt,
    })
  }
  catch (err) {
    logger.error(`Password reset validate error: ${err.message}`)
    return res.status(500).json({ status: 'error', message: 'Failed to validate reset token' })
  }
})

router.post('/password-reset/accept', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ status: 'error', message: 'token and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ status: 'error', message: 'password must be at least 8 characters' })
    }

    let user
    try {
      user = await db.user.consumePasswordResetToken(token, password)
    }
    catch (err) {
      return res.status(400).json({ status: 'error', message: err.message })
    }

    logger.info(`User ${user.name} reset their password`)

    return res.status(200).json({ status: 'success', user })
  }
  catch (err) {
    logger.error(`Password reset accept error: ${err.message}`)
    return res.status(500).json({ status: 'error', message: 'Failed to reset password' })
  }
})

export default router

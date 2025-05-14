import db from '#/models/db.js'
import logger from '#/utils/logger.js'
import { BadRequestError, NotFoundError } from '#/utils/errors.js'
import { ObjectId } from 'mongodb'

/**
 * Get all lobbies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllLobbies = async (req, res, next) => {
  try {
    const lobbiesCursor = await db.lobby.all()
    const lobbiesArray = await lobbiesCursor.toArray()

    res.json({
      status: 'success',
      lobbies: lobbiesArray
    })
  }
  catch (err) {
    logger.error(`Error fetching all lobbies: ${err.message}`)
    next(err)
  }
}

/**
 * Create a new lobby
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createLobby = async (req, res, next) => {
  try {
    const user = req.user

    if (!user) {
      return next(new BadRequestError('Invalid user for lobby creation'))
    }

    const lobbyId = await db.lobby.create()

    if (!lobbyId) {
      return next(new BadRequestError('Failed to create new lobby'))
    }

    const lobby = await db.lobby.findById(lobbyId)
    const userIds = req.body.userIds || [user._id]

    try {
      // Validate userIds are valid ObjectIds
      const objectIds = userIds.map(id => new ObjectId(id))
      const userCursor = await db.user.findByIds(objectIds)
      const users = await userCursor.toArray()

      lobby.users = users.map(user => ({
        _id: user._id,
        name: user.name
      }))

      if (req.body.game) {
        lobby.game = req.body.game
      }

      if (req.body.options) {
        lobby.options = req.body.options
      }

      await db.lobby.save(lobby)

      res.json({
        status: 'success',
        lobbyId
      })
    }
    catch (err) {
      logger.error(`Error processing userIds: ${err.message}`)
      return next(new BadRequestError('Invalid user ID format in array'))
    }
  }
  catch (err) {
    logger.error(`Error creating lobby: ${err.message}`)
    next(err)
  }
}

/**
 * Get lobby information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getLobbyInfo = async (req, res, next) => {
  try {
    const lobby = req.lobby

    if (!lobby) {
      return next(new NotFoundError(`Lobby with id ${req.body.lobbyId} not found`))
    }

    res.json({
      status: 'success',
      lobby
    })
  }
  catch (err) {
    logger.error(`Error fetching lobby info: ${err.message}`)
    next(err)
  }
}

/**
 * Kill (delete) a lobby
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const killLobby = async (req, res, next) => {
  try {
    if (!req.lobby) {
      return next(new NotFoundError('Lobby not found'))
    }

    await db.lobby.kill(req.lobby)

    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error killing lobby: ${err.message}`)
    next(err)
  }
}

/**
 * Save changes to a lobby
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const saveLobby = async (req, res, next) => {
  try {
    if (!req.body || !req.body._id) {
      return next(new BadRequestError('Invalid lobby data'))
    }

    await db.lobby.save(req.body)

    res.json({
      status: 'success'
    })
  }
  catch (err) {
    logger.error(`Error saving lobby: ${err.message}`)
    next(err)
  }
}

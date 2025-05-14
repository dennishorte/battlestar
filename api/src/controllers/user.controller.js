import { ObjectId } from 'mongodb'
import db from '#/models/db.js'
import { BadRequestError, NotFoundError } from '#/utils/errors.js'
import logger from '#/utils/logger.js'

// User controller methods
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.user.all()
    res.json({
      status: 'success',
      users
    })
  }
  catch (err) {
    logger.error(`Error fetching all users: ${err.message}`)
    next(err)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const { name, password, slack } = req.body

    if (!name || !password) {
      return next(new BadRequestError('Name and password are required'))
    }

    try {
      await db.user.create({
        name,
        password,
        slack,
      })

      res.json({
        status: 'success',
        message: 'User created'
      })
    }
    catch (err) {
      return next(new BadRequestError(err.toString()))
    }
  }
  catch (err) {
    logger.error(`Error creating user: ${err.message}`)
    next(err)
  }
}

export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.body

    if (!id) {
      return next(new BadRequestError('User ID is required'))
    }

    try {
      const objectId = new ObjectId(id)
      const result = await db.user.deactivate(objectId)

      if (result.modifiedCount == 1) {
        res.json({ status: 'success' })
      }
      else {
        res.json({
          status: 'error',
          message: 'User not deactivated'
        })
      }
    }
    catch {
      return next(new BadRequestError('Invalid user ID format'))
    }
  }
  catch (err) {
    logger.error(`Error deactivating user: ${err.message}`)
    next(err)
  }
}

export const fetchManyUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body

    if (!userIds || !Array.isArray(userIds)) {
      return next(new BadRequestError('userIds must be an array'))
    }

    try {
      const objectIds = userIds.map(id => new ObjectId(id))
      const usersCursor = await db.user.findByIds(objectIds)
      const usersArray = await usersCursor.toArray()

      res.json({
        status: 'success',
        users: usersArray
      })
    }
    catch (e) {
      return next(e)
      //return next(new BadRequestError('Invalid user ID format in array'))
    }
  }
  catch (err) {
    logger.error(`Error fetching users: ${err.message}`)
    next(err)
  }
}

export const getUserLobbies = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      const objectId = new ObjectId(userId)
      const lobbyCursor = await db.lobby.findByUserId(objectId)
      const lobbyArray = await lobbyCursor.toArray()

      res.json({
        status: 'success',
        lobbies: lobbyArray
      })
    }
    catch {
      return next(new BadRequestError('Invalid userId format'))
    }
  }
  catch (err) {
    logger.error(`Error fetching user lobbies: ${err.message}`)
    next(err)
  }
}

export const getUserGames = async (req, res, next) => {
  try {
    const filters = {}

    if (req.body.userId) {
      try {
        const objectId = new ObjectId(req.body.userId)
        filters['settings.players._id'] = objectId
      }
      catch {
        return next(new BadRequestError('Invalid userId format'))
      }
    }

    if (req.body.state) {
      if (req.body.state === 'all') {
        // Do nothing. Get all game states.
      }
    }
    else {
      filters.gameOver = false
    }

    if (req.body.kind) {
      filters['settings.game'] = req.body.kind
    }

    if (req.body.killed === false) {
      filters.killed = { $ne: true }
    }

    const gameCursor = await db.game.find(filters)
    const gameArray = await gameCursor.toArray()

    res.json({
      status: 'success',
      games: gameArray
    })
  }
  catch (err) {
    logger.error(`Error fetching user games: ${err.message}`)
    next(err)
  }
}

export const getRecentlyFinishedGames = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      const objectId = new ObjectId(userId)
      const gameCursor = await db.game.findRecentlyFinishedByUserId(objectId)
      const gameArray = await gameCursor.toArray()

      res.json({
        status: 'success',
        games: gameArray
      })
    }
    catch {
      return next(new BadRequestError('Invalid userId format'))
    }
  }
  catch (err) {
    logger.error(`Error fetching recently finished games: ${err.message}`)
    next(err)
  }
}

export const getNextGame = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      const objectId = new ObjectId(userId)
      const user = await db.user.findById(objectId)

      if (!user) {
        return next(new NotFoundError(`User with ID ${userId} not found`))
      }

      const userName = user.name
      const gameCursor = await db.game.findByUserId(objectId)
      const gameArray = await gameCursor.toArray()

      if (req.game) {
        for (let i = 0; i < gameArray.length; i++) {
          if (!gameArray[gameArray.length - 1]._id.equals(req.game._id)) {
            gameArray.push(gameArray.shift())
          }
          else {
            break
          }
        }
      }

      const gameIds = gameArray
        .filter(game => !!game.waiting)
        .filter(game => game.waiting.includes(userName))
        .map(game => game._id)

      const nextId = gameIds.length > 0 ? gameIds[0] : undefined

      res.json({
        status: 'success',
        gameId: nextId
      })
    }
    catch {
      return next(new BadRequestError('Invalid userId format'))
    }
  }
  catch (err) {
    logger.error(`Error getting next game: ${err.message}`)
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { userId, name, slack } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      await db.user.update({
        userId: new ObjectId(userId),
        name,
        slack
      })

      res.json({
        status: 'success',
        message: 'User updated'
      })
    }
    catch (err) {
      return next(new BadRequestError('Error updating user: ' + err.message))
    }
  }
  catch (err) {
    logger.error(`Error updating user: ${err.message}`)
    next(err)
  }
}

// Magic related controllers
export const magic_getCubes = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      const objectId = new ObjectId(userId)
      const cubes = await db.magic.cube.findByUserId(objectId)

      res.json({
        status: 'success',
        cubes
      })
    }
    catch {
      return next(new BadRequestError('Invalid userId format or error accessing cubes'))
    }
  }
  catch (err) {
    logger.error(`Error fetching Magic cubes: ${err.message}`)
    next(err)
  }
}

export const magic_getDecks = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      const objectId = new ObjectId(userId)
      const decks = await db.magic.deck.findByUserId(objectId)

      res.json({
        status: 'success',
        decks
      })
    }
    catch {
      return next(new BadRequestError('Invalid userId format or error accessing decks'))
    }
  }
  catch (err) {
    logger.error(`Error fetching Magic decks: ${err.message}`)
    next(err)
  }
}

export const magic_getFiles = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return next(new BadRequestError('userId is required'))
    }

    try {
      const objectId = new ObjectId(userId)
      const files = [
        await db.magic.deck.findByUserId(objectId),
        await db.magic.cube.findByUserId(objectId)
      ].flat()

      res.json({
        status: 'success',
        files
      })
    }
    catch {
      return next(new BadRequestError('Invalid userId format or error accessing files'))
    }
  }
  catch (err) {
    logger.error(`Error fetching Magic files: ${err.message}`)
    next(err)
  }
}

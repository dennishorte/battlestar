import db from '../models/db.js'
import logger from '../utils/logger.js'
import stats from '../utils/stats.js'
import gameService from '../services/game_service.js'
import { NotFoundError } from '../utils/errors.js'
import { GameOverwriteError, GameKilledError } from '../middleware/loaders.js'

// Game controller methods
export const create = async (req, res, next) => {
  try {
    const lobby = req.lobby
    const game = await gameService.create(lobby, req.body.linkedDraftId)

    return res.json({
      status: 'success',
      gameId: game._id,
    })
  }
  catch (err) {
    logger.error(`Error creating game: ${err.message}`)
    next(err)
  }
}

export const insert = async (req, res, next) => {
  try {
    const gameId = await gameService.insert(req.body.data)

    return res.json({
      status: 'success',
      gameId,
    })
  }
  catch (err) {
    logger.error(`Error creating game: ${err.message}`)
    next(err)
  }
}

export const fetchAll = async (req, res, next) => {
  try {
    const cursor = await db.game.all()
    const games = await cursor.toArray()

    res.json({
      status: 'success',
      games
    })
  }
  catch (err) {
    logger.error(`Error fetching all games: ${err.message}`)
    next(err)
  }
}

export const fetch = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }

    return res.json({
      status: 'success',
      game: req.game.serialize(),
    })
  }
  catch (err) {
    logger.error(`Error fetching game: ${err.message}`)
    next(err)
  }
}

export const kill = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }

    await gameService.kill(req.game)

    res.json({
      status: 'success',
    })
  }
  catch (err) {
    logger.error(`Error killing game: ${err.message}`)
    next(err)
  }
}

export const rematch = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }

    const lobby = await gameService.rematch(req.game)

    res.json({
      status: 'success',
      lobbyId: lobby._id
    })
  }
  catch (err) {
    logger.error(`Error creating rematch: ${err.message}`)
    next(err)
  }
}

export const saveFull = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }

    const serializedGame = await gameService.saveFull(req.game, {
      branchId: req.body.branchId,
      chat: req.body.chat,
      gameOver: req.body.gameOver,
      gameOverData: req.body.gameOverData,
      overwrite: req.body.overwrite,
      responses: req.body.responses,
      waiting: req.body.waiting,
    })

    res.json({
      status: 'success',
      serializedGame,
    })
  }
  catch (err) {
    if (err instanceof GameOverwriteError || err instanceof GameKilledError) {
      return res.status(409).json({
        status: 'error',
        message: err.message,
        code: err.code
      })
    }

    logger.error(`Error saving game: ${err.message}`)
    next(err)
  }
}

export const saveResponse = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }

    const serializedGame = await gameService.saveResponse(req.game, req.body.response)

    res.json({
      status: 'success',
      serializedGame,
    })
  }
  catch (err) {
    logger.error(`Error saving response: ${err.message}`)
    next(err)
  }
}

export const undo = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }

    const serializedGame = await gameService.undo(req.game, req.body.count)

    return res.json({
      status: 'success',
      serializedGame,
    })
  }
  catch (err) {
    logger.error(`Error undoing action: ${err.message}`)
    next(err)
  }
}

// Statistics
export const stats_innovation = async (req, res, next) => {
  try {
    const cursor = await db.game.find(
      {
        'settings.game': 'Innovation',
        'settings.players.2': { $exists: false }, // Two player games only
        'stats.error': false,
        gameOver: true,
        killed: false,
      },
      {
        _id: 0,
        stats: 1,
        settings: 1,
      },
    )

    res.json({
      status: 'success',
      data: await stats.processInnovationStats(cursor),
    })
  }
  catch (err) {
    logger.error(`Error fetching innovation stats: ${err.message}`)
    next(err)
  }
}

export const stats_agricola = async (req, res, next) => {
  try {
    const cursor = await db.game.find(
      {
        'settings.game': 'Agricola',
        'stats.error': { $ne: true },
        gameOver: true,
        killed: { $ne: true },
      },
      { _id: 0, stats: 1, settings: 1 },
    )

    res.json({
      status: 'success',
      data: await stats.processAgricolaStats(cursor),
    })
  }
  catch (err) {
    logger.error(`Error fetching agricola stats: ${err.message}`)
    next(err)
  }
}

export const saveNotes = async (req, res, next) => {
  try {
    const { gameId, notes } = req.body
    const playerName = req.user.name

    await db.game.saveNotes(gameId, playerName, notes)

    res.json({ status: 'success' })
  }
  catch (err) {
    logger.error(`Error saving notes: ${err.message}`)
    next(err)
  }
}

export const fetchNotes = async (req, res, next) => {
  try {
    const { gameId } = req.body
    const playerName = req.user.name

    const notes = await db.game.getNotes(gameId, playerName)

    res.json({ status: 'success', notes })
  }
  catch (err) {
    logger.error(`Error fetching notes: ${err.message}`)
    next(err)
  }
}

export const saveCardOrder = async (req, res, next) => {
  try {
    const { gameId, cardOrder } = req.body
    const playerName = req.user.name

    await db.game.saveCardOrder(gameId, playerName, cardOrder)

    res.json({ status: 'success' })
  }
  catch (err) {
    logger.error(`Error saving card order: ${err.message}`)
    next(err)
  }
}

export const fetchCardOrder = async (req, res, next) => {
  try {
    const { gameId } = req.body
    const playerName = req.user.name

    const cardOrder = await db.game.getCardOrder(gameId, playerName)

    res.json({ status: 'success', cardOrder })
  }
  catch (err) {
    logger.error(`Error fetching card order: ${err.message}`)
    next(err)
  }
}

const db = require('../models/db.js')
const logger = require('../utils/logger')
const stats = require('../utils/stats')
const gameService = require('../services/game_service')
const { GameOverEvent, fromData } = require('battlestar-common')
const { NotFoundError, BadRequestError } = require('../utils/errors')
const { GameOverwriteError, GameKilledError } = require('../middleware/data-loader')

// Game controller methods
exports.create = async (req, res, next) => {
  try {
    const lobby = req.lobby
    const game = await gameService.create(lobby, req.body.linkedDraftId)
    
    return res.json({
      status: 'success',
      gameId: game._id,
    })
  } catch (err) {
    logger.error(`Error creating game: ${err.message}`)
    next(err)
  }
}

exports.fetchAll = async (req, res, next) => {
  try {
    const cursor = await db.game.all()
    const games = await cursor.toArray()
    
    res.json({
      status: 'success',
      games
    })
  } catch (err) {
    logger.error(`Error fetching all games: ${err.message}`)
    next(err)
  }
}

exports.fetch = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }
    
    return res.json({
      status: 'success',
      game: req.game.serialize(),
    })
  } catch (err) {
    logger.error(`Error fetching game: ${err.message}`)
    next(err)
  }
}

exports.kill = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }
    
    await gameService.kill(req.game)
    
    res.json({
      status: 'success',
    })
  } catch (err) {
    logger.error(`Error killing game: ${err.message}`)
    next(err)
  }
}

exports.rematch = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }
    
    const lobby = await gameService.rematch(req.game)
    
    res.json({
      status: 'success',
      lobbyId: lobby._id
    })
  } catch (err) {
    logger.error(`Error creating rematch: ${err.message}`)
    next(err)
  }
}

exports.saveFull = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }
    
    const serializedGame = await gameService.saveFull(req.game, {
      chat: req.body.chat,
      responses: req.body.responses,
      waiting: req.body.waiting,
      gameOver: req.body.gameOver,
      gameOverData: req.body.gameOverData,
      branchId: req.body.branchId,
      overwrite: req.body.overwrite,
    })
    
    res.json({
      status: 'success',
      serializedGame,
    })
  } catch (err) {
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

exports.saveResponse = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }
    
    const serializedGame = await gameService.saveResponse(req.game, req.body.response)
    
    res.json({
      status: 'success',
      serializedGame,
    })
  } catch (err) {
    logger.error(`Error saving response: ${err.message}`)
    next(err)
  }
}

exports.undo = async (req, res, next) => {
  try {
    if (!req.game) {
      return next(new NotFoundError('Game not found'))
    }
    
    const serializedGame = await gameService.undo(req.game, req.body.count)
    
    return res.json({
      status: 'success',
      serializedGame,
    })
  } catch (err) {
    logger.error(`Error undoing action: ${err.message}`)
    next(err)
  }
}

// Statistics
exports.stats = {
  innovation: async (req, res, next) => {
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
    } catch (err) {
      logger.error(`Error fetching innovation stats: ${err.message}`)
      next(err)
    }
  }
} 

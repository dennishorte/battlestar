const AsyncLock = require('async-lock')
const db = require('../models/db.js')
const { fromData } = require('battlestar-common')
const { NotFoundError, GameOverwriteError, GameKilledError } = require('../utils/errors')
const logger = require('../utils/logger')

const lock = new AsyncLock()

async function _loadGame(gameId) {
  // Load item data from database
  const gameData = await db.game.findById(gameId)

  if (!gameData) {
    return new NotFoundError(`Game not found. ID: ${gameId}`)
  }
  else {
    return fromData(gameData)
  }
}

const itemLoaders = {
  draft: async (id) => await _loadGame(id),
  game: async (id) => await _loadGame(id),
  lobby: async (id) => await db.lobby.findById(id)
}

async function _loadItemWithLockById(itemType, req, res, next) {
  ////////////////////
  // Helper Funcs

  async function _initializeLock() {
    // Acquire the lock but don't release it immediately
    const lockKey = `${itemType}:${id}`
    const unlockFn = await lock.acquire(lockKey, () => {
      return () => {}
    })
    res.locals.unlock = unlockFn
    res.on('finish', () => {
      if (unlockFn && !res.locals.lockReleased) {
        res.locals.lockReleased = true
        unlockFn()
      }
    })
  }

  async function _loadItem() {
    // Check if we have a loader for this item type
    if (!itemLoaders[itemType]) {
      return next(new Error(`Can't load item with type: ${itemType}`))
    }

    const item = await itemLoaders[itemType](id)
    if (item instanceof Error) {
      return next(item)
    }

    return item
  }

  ////////////////////
  // Main Logic
  
  const id = req.body[itemType + 'Id']
  if (!id) {
    // No item of this type was specified, just continue
    return next()
  }

  try {
    await _initializeLock()
    
    const item = await _loadItem()
    if (!item) {
      return next(new NotFoundError(`${itemType} not found with id: ${id}`))
    }

    // Store the loaded item in the request object
    req[itemType] = item
    
    next()
  }
  catch (err) {
    logger.error(`Error loading ${itemType}: ${err.message}`)
    next(err)
  }
}

const loadCubeArgs = (req, res, next) => _loadItemWithLockById('cube', req, res, next)
const loadDraftArgs = (req, res, next) => _loadItemWithLockById('draft', req, res, next)
const loadGameArgs = (req, res, next) => _loadItemWithLockById('game', req, res, next)
const loadLobbyArgs = (req, res, next) => _loadItemWithLockById('lobby', req, res, next)

module.exports = {
  loadCubeArgs,
  loadDraftArgs,
  loadGameArgs,
  loadLobbyArgs,
  GameOverwriteError,
  GameKilledError
} 

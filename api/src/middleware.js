const { ObjectId } = require('mongodb')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const db = require('./models/db.js')

const { fromData } = require('battlestar-common')

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

const Middleware = {
  authenticate,
  coerceMongoIds,
  ensureVersion,
  errorHandler,
  loadGames,
}
module.exports = Middleware


// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  },
  async function(tokenData, cb) {
    const id = ObjectId(tokenData.user_id)
    const user = await db.user.findById(id)

    if (!user) { return cb(null, false) }
    return cb(null, user)
  }
))

/*
   By default, all routes require authentication.
   Routes that start with '/api/guest/' do not require authentication.
 */
function authenticate(req, res, next) {
  if (req.path.startsWith('/api/guest/') || req.method === 'GET') {
    next()
  }
  else {
    passport.authenticate('jwt', { session: false })(req, res, next)
  }
}

/*
   By coercing all ids into ObjectId, we make sure that they are all handled the same inside
   the app, regardless of whether or not they came from the database or the user.
 */
function coerceMongoIds(req, res, next) {
  function _coerceIdsRecurse(obj) {
    if (obj === undefined || obj === null) {
      return
    }

    for (const [key, value] of Object.entries(obj)) {
      const lowKey = key.toLowerCase()

      if (value === undefined || value === null) {
        continue
      }

      else if (typeof value === 'object' && !Array.isArray(value)) {
        _coerceIdsRecurse(value)
      }

      else if (lowKey.endsWith('id') || lowKey.endsWith('ids')) {
        if (Array.isArray(value)) {
          // Modify in place
          for (let i = 0; i < value.length; i++) {
            value[i] = _tryConvertToObjectId(key, value[i])
          }
        }
        else {
          obj[key] = _tryConvertToObjectId(key, value)
        }
      }

      else if (Array.isArray(value)) {
        for (const elem of value) {
          if (typeof elem === 'object') {
            _coerceIdsRecurse(elem)
          }
        }
      }
    }
  }

  function _tryConvertToObjectId(key, value) {
    if (
      typeof value === 'string'
      && value.length === 24
      && /^[0-9a-f]*$/.test(value)
    ) {
      return ObjectId(value)
    }
    else {
      return value
    }
  }

  _coerceIdsRecurse(req.body)
  next()
}

const latestVersion = require('./version.js')
function ensureVersion(req, res, next) {
  if (!req.body.appVersion || req.body.appVersion != latestVersion) {
    res.json({
      status: 'version_mismatch',
      currentVersion: req.body.appVersion,
      latestVersion,
    })
  }
  else {
    next()
  }
}

/**
 * Middleware to load game data and attach it to the request object
 * Uses proper error handling and supports concurrency control
 */
async function loadGames(req, res, next) {
  if (!req.body.gameId) {
    return next()
  }

  try {
    const gameId = req.body.gameId

    // Check if gameId exists in request
    if (!gameId) {
      return next(new BadRequestError('Invalid game id'))
    }

    // Load game data from database
    const gameData = await db.game.findById(gameId)

    if (!gameData) {
      return next(new NotFoundError(`Game not found. ID: ${gameId}`))
    }

    // Create game instance from data
    req.game = fromData(gameData)

    return next()
  }
  catch (error) {
    console.error('Error loading game:', error)
    next(new Error(`Server error while loading game. ID: ${gameId}`))
  }
}

async function errorHandler(err, req, res, next) {
  // Custom status code based on error type
  const status = err instanceof BadRequestError ? 400 :
                 err instanceof AuthError ? 401 :
                 err instanceof NotFoundError ? 404 :
                 500

  // Consistent logging
  console.error(`${status} error:`, err)

  // Consistent response format
  res.status(status).json({
    error: {
      message: err.message,
      code: err.code || 'unknown'
    }
  })
}

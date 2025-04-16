class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication Failed') {
    super(message, 401)
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404)
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409)
  }
}

class GameOverwriteError extends Error {
  constructor(message) {
    super(message || 'game overwrite')
    this.name = 'GameOverwriteError'
    this.code = 'game_overwrite'
    this.statusCode = 409
  }
}

class GameKilledError extends Error {
  constructor(message) {
    super(message || 'game killed')
    this.name = 'GameKilledError'
    this.code = 'game_killed'
    this.statusCode = 409
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500)
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  GameOverwriteError,
  GameKilledError,
  InternalServerError
} 

const logger = require('../utils/logger')
const { AppError } = require('../utils/errors')

/**
 * Global error handling middleware
 */
async function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  })

  // Operational, trusted error: send message to client
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: err.code
    })
  }

  // Handle known error types with status codes
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code
    })
  }

  // Unknown error, don't leak error details to client
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  })
}

module.exports = errorHandler 

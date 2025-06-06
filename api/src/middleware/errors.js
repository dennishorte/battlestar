import logger from '../utils/logger.js'
import { AppError } from '../utils/errors.js'

/**
 * Global error handling middleware
 */
// eslint-disable-next-line no-unused-vars
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

export { errorHandler }
export default { errorHandler }

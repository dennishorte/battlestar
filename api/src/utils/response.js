/**
 * Send a success response
 *
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in response
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
function success(res, data = null, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data
  })
}

/**
 * Send an error response
 *
 * @param {Object} res - Express response object
 * @param {Error|String} err - Error object or error message
 */
function error(res, err) {
  // Default error status code
  let statusCode = 500
  let errorMessage = err

  // Handle Error objects
  if (err instanceof Error) {
    errorMessage = err.message
    // Use error's status code if available
    if (err.status) {
      statusCode = err.status
    }
  }

  // Prepare response data
  const responseData = {
    success: false,
    error: errorMessage
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development' && err instanceof Error) {
    responseData.stack = err.stack
  }

  res.status(statusCode).json(responseData)
}

export {
  success,
  error
}

const errorHandler = require('../../../src/middleware/errors.js').errorHandler
const { BadRequestError, NotFoundError } = require('../../../src/utils/errors.js')

// Mock the logger
jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn()
}))

const logger = require('../../../src/utils/logger.js')

describe('Error Handler Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      path: '/api/test',
      method: 'GET',
      body: { someData: 'test' }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should handle AppError with appropriate status code and message', async () => {
    // Setup - create a BadRequestError (which extends AppError)
    const error = new BadRequestError('Invalid data format')

    // Execute
    await errorHandler(error, req, res, next)

    // Verify
    expect(logger.error).toHaveBeenCalledWith(
      `Error: ${error.message}`,
      expect.objectContaining({
        stack: error.stack,
        path: req.path,
        method: req.method,
        body: req.body
      })
    )
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Invalid data format',
      code: undefined
    })
  })

  it('should handle NotFoundError correctly', async () => {
    // Setup
    const error = new NotFoundError('Resource not found')

    // Execute
    await errorHandler(error, req, res, next)

    // Verify
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Resource not found',
      code: undefined
    })
  })

  it('should handle errors with statusCode that are not AppError instances', async () => {
    // Setup - an error with statusCode but not an AppError instance
    const error = new Error('Custom error')
    error.statusCode = 403
    error.code = 'forbidden_action'

    // Execute
    await errorHandler(error, req, res, next)

    // Verify
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Custom error',
      code: 'forbidden_action'
    })
  })

  it('should return 500 for unknown errors', async () => {
    // Setup - a standard Error with no statusCode
    const error = new Error('Something broke')

    // Execute
    await errorHandler(error, req, res, next)

    // Verify
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong'
    })
  })

  it('should not expose internal error details in production', async () => {
    // Store original NODE_ENV
    const originalEnv = process.env.NODE_ENV

    try {
      // Set to production
      process.env.NODE_ENV = 'production'

      // Setup - a standard Error with sensitive details
      const error = new Error('Database connection failed: credentials invalid')

      // Execute
      await errorHandler(error, req, res, next)

      // Verify - should not include the sensitive error message
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went wrong'
      })
    }
    finally {
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalEnv
    }
  })
})

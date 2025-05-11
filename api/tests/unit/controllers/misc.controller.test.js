// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}))

// Mock db
jest.mock('../../../src/models/db', () => ({
  misc: {
    appVersion: jest.fn().mockResolvedValue('1.0.0')
  }
}))

// Import after mocks are set up
const miscController = require('../../../src/controllers/misc.controller')
const db = require('../../../src/models/db')
const logger = require('../../../src/utils/logger')

describe('Misc Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getAppVersion', () => {
    it('should return the application version', async () => {
      // Execute
      await miscController.getAppVersion(req, res, next)

      // Verify
      expect(db.misc.appVersion).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        version: '1.0.0'
      })
    })

    it('should handle errors properly', async () => {
      // Setup
      const error = new Error('Database error')
      db.misc.appVersion.mockRejectedValueOnce(error)

      // Execute
      await miscController.getAppVersion(req, res, next)

      // Verify
      expect(logger.error).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})

const scryfallController = require('../../../../src/controllers/magic/scryfall.controller.js')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  magic: {
    scryfall: {
      update: jest.fn()
    }
  }
}))

const db = require('../../../../src/models/db.js')

describe('Scryfall Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {}
    }
    res = {
      json: jest.fn()
    }
    jest.clearAllMocks()
  })

  describe('update', () => {
    it('should update all Scryfall data and return success response', async () => {
      // Setup
      const mockResult = {
        cardsAdded: 100,
        cardsUpdated: 50,
        totalTime: '10.5s'
      }
      db.magic.scryfall.update.mockResolvedValueOnce(mockResult)

      // Execute
      await scryfallController.update(req, res)

      // Verify
      expect(db.magic.scryfall.update).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Scryfall data updated',
        ...mockResult
      })
    })
  })
})

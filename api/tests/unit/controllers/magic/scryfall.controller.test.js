const scryfallController = require('../../../../src/controllers/magic/scryfall.controller')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  magic: {
    scryfall: {
      updateAll: jest.fn()
    }
  }
}))

const db = require('../../../../src/models/db')

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

  describe('updateAll', () => {
    it('should update all Scryfall data and return success response', async () => {
      // Setup
      const mockResult = { 
        cardsAdded: 100, 
        cardsUpdated: 50, 
        totalTime: '10.5s' 
      }
      db.magic.scryfall.updateAll.mockResolvedValueOnce(mockResult)
      
      // Execute
      await scryfallController.updateAll(req, res)
      
      // Verify
      expect(db.magic.scryfall.updateAll).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Scryfall data updated',
        ...mockResult
      })
    })
  })
}) 

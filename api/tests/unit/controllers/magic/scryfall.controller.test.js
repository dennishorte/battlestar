import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import * as scryfallController from '../../../../src/controllers/magic/scryfall.controller.js'

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  }
})

import axios from 'axios'

describe('Scryfall Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      query: {}
    }
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    vi.clearAllMocks()
  })

  describe('search', () => {
    it('should search Scryfall and return the results', async () => {
      // Setup
      const mockQuery = 'lightning bolt'
      const mockScryfallResponse = {
        data: {
          data: [
            { id: '1', name: 'Lightning Bolt', set: 'alpha' },
            { id: '2', name: 'Lightning Bolt', set: 'beta' }
          ],
          has_more: false
        }
      }
      
      req.query.q = mockQuery
      axios.get.mockResolvedValueOnce(mockScryfallResponse)

      // Execute
      await scryfallController.search(req, res)

      // Verify
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(mockQuery)}`)
      )
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        cards: mockScryfallResponse.data.data,
        has_more: false
      })
    })

    it('should return error when the query is missing', async () => {
      // Execute
      await scryfallController.search(req, res)

      // Verify
      expect(axios.get).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing required query parameter: q'
      })
    })

    it('should handle errors from the Scryfall API', async () => {
      // Setup
      req.query.q = 'lightning bolt'
      const errorMessage = 'Scryfall API error'
      axios.get.mockRejectedValueOnce(new Error(errorMessage))

      // Mock console.error to prevent log output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Execute
      await scryfallController.search(req, res)

      // Verify
      expect(axios.get).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: expect.stringContaining(errorMessage)
      })

      consoleErrorSpy.mockRestore()
    })
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../../../src/utils/mongo.js', () => {
  return {
    client: {
      db: vi.fn(() => ({
        collection: vi.fn(() => ({
          find: vi.fn(),
          findOne: vi.fn(),
          insertOne: vi.fn(),
          updateOne: vi.fn(),
          deleteOne: vi.fn()
        }))
      }))
    }
  }
})

vi.mock('../../../../src/models/db.js', () => {
  return {
    default: {
      magic: {
        scryfall: {
          runFullUpdate: vi.fn()
        }
      }
    }
  }
})

vi.mock('../../../../src/services/scryfall_update_job.js', () => {
  return {
    start: vi.fn(),
    getStatus: vi.fn(),
  }
})

import * as scryfallController from '../../../../src/controllers/magic/scryfall_controller.js'
import * as job from '../../../../src/services/scryfall_update_job.js'

describe('Scryfall Controller', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, query: {} }
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    }
    vi.clearAllMocks()
  })

  describe('update', () => {
    it('returns started=true when job kicks off', async () => {
      job.start.mockReturnValueOnce(true)
      job.getStatus.mockReturnValue({ running: true, phase: 'starting', log: [] })

      await scryfallController.update(req, res)

      expect(job.start).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'started',
        running: true,
      }))
    })

    it('returns 409 when a job is already running', async () => {
      job.start.mockReturnValueOnce(false)
      job.getStatus.mockReturnValue({ running: true, phase: 'download', log: ['x'] })

      await scryfallController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Update already running',
      }))
    })
  })

  describe('updateStatus', () => {
    it('returns the current job status', async () => {
      const status = {
        running: false,
        phase: 'done',
        log: ['a', 'b'],
        error: null,
        result: { sets: 800, cards: 30000, version: 'default-cards.json' },
      }
      job.getStatus.mockReturnValueOnce(status)

      await scryfallController.updateStatus(req, res)

      expect(res.json).toHaveBeenCalledWith({ status: 'success', ...status })
    })
  })
})

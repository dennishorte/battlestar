import { coerceMongoIds, ensureVersion } from '../../src/middleware/validators.js'
import { ObjectId } from 'mongodb'
import { describe, it, expect, vi } from 'vitest'

// Mock the version module
vi.mock('../../src/version', () => {
  return {
    default: '1.0.0'
  }
})

describe('Middleware - Validation', () => {
  describe('coerceMongoIds', () => {
    it('should convert string ids to ObjectId', () => {
      const req = {
        body: {
          userId: '507f1f77bcf86cd799439011',
          gameIds: ['507f191e810c19729de860ea', '507f191e810c19729de860eb'],
          nested: {
            lobbyId: '507f191e810c19729de860ec'
          }
        }
      }

      const next = vi.fn()

      coerceMongoIds(req, {}, next)

      expect(req.body.userId).toBeInstanceOf(ObjectId)
      expect(req.body.userId.toString()).toBe('507f1f77bcf86cd799439011')

      expect(req.body.gameIds[0]).toBeInstanceOf(ObjectId)
      expect(req.body.gameIds[0].toString()).toBe('507f191e810c19729de860ea')

      expect(req.body.nested.lobbyId).toBeInstanceOf(ObjectId)
      expect(req.body.nested.lobbyId.toString()).toBe('507f191e810c19729de860ec')

      expect(next).toHaveBeenCalled()
    })

    it('should not convert non-MongoDB-id strings', () => {
      const req = {
        body: {
          userId: 'not-a-mongo-id',
          someId: 'abcdefghijklmnopqrstuvwx', // 24 chars but not hex
          normal: 'value'
        }
      }

      const next = vi.fn()

      coerceMongoIds(req, {}, next)

      expect(req.body.userId).toBe('not-a-mongo-id')
      expect(req.body.someId).toBe('abcdefghijklmnopqrstuvwx')
      expect(req.body.normal).toBe('value')

      expect(next).toHaveBeenCalled()
    })
  })

  describe('ensureVersion', () => {
    it('should call next when version matches', () => {
      const req = {
        body: {
          appVersion: '1.0.0'
        }
      }

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      }

      const next = vi.fn()

      ensureVersion(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should return error when version mismatches', () => {
      const req = {
        body: {
          appVersion: '0.9.0'
        }
      }

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      }

      const next = vi.fn()

      ensureVersion(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'version_mismatch',
        currentVersion: '0.9.0'
      }))
    })
  })
})

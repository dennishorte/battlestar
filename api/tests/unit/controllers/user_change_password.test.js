import { describe, it, expect, beforeEach, vi } from 'vitest'

import logger from '../../mocks/logger.mock.js'
import db from '../../mocks/db.mock.js'

vi.mock('mongodb', () => {
  return {
    ObjectId: vi.fn().mockImplementation(id => id)
  }
})

vi.mock('../../../src/utils/logger', () => {
  return { default: logger }
})

vi.mock('../../../src/models/db', () => {
  return { default: db }
})

import * as userController from '../../../src/controllers/user_controller.js'
import { BadRequestError } from '../../../src/utils/errors.js'

describe('changePassword', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    next = vi.fn()
    vi.clearAllMocks()
  })

  it('should return 400 when fields are missing', async () => {
    req.body = { userId: 'user1' }
    await userController.changePassword(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    expect(next.mock.calls[0][0].message).toMatch(/required/)
  })

  it('should return 400 when current password is wrong', async () => {
    req.body = {
      userId: 'user1',
      currentPassword: 'wrong',
      newPassword: 'newpass123',
    }
    db.user.changePassword.mockRejectedValueOnce(new Error('Current password is incorrect'))

    await userController.changePassword(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
    expect(next.mock.calls[0][0].message).toBe('Current password is incorrect')
  })

  it('should return 200 on success', async () => {
    req.body = {
      userId: 'user1',
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
    }
    db.user.changePassword.mockResolvedValueOnce({ modifiedCount: 1 })

    await userController.changePassword(req, res, next)

    expect(db.user.changePassword).toHaveBeenCalledWith(expect.anything(), 'oldpass', 'newpass123')
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Password changed',
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

vi.mock('../../src/models/db.js', async () => {
  const dbMock = await import('../mocks/db.mock.js')
  return { default: dbMock.default }
})

vi.mock('passport', async () => {
  const passportMock = await import('../mocks/passport.mock.js')
  return { default: passportMock.default }
})

vi.mock('../../src/version.js', () => {
  return { default: 1747165976913 }
})

vi.mock('../../src/utils/logger.js', async () => {
  const loggerMock = await import('../mocks/logger.mock.js')
  return { default: loggerMock.default }
})

import { app } from '../../server.js'
import db from '../../src/models/db.js'

const SECRET = process.env.SECRET_KEY || 'test-secret-key'
const APP_VERSION = 1747165976913

describe('Invite API', () => {
  let adminUser
  let adminToken
  let nonAdminUser
  let nonAdminToken

  beforeEach(() => {
    adminUser = {
      _id: new ObjectId(),
      name: 'dennis',
    }
    nonAdminUser = {
      _id: new ObjectId(),
      name: 'someone-else',
    }

    adminToken = jwt.sign({ user_id: adminUser._id.toString() }, SECRET, { expiresIn: '1h' })
    nonAdminToken = jwt.sign({ user_id: nonAdminUser._id.toString() }, SECRET, { expiresIn: '1h' })

    db.user.findById.mockReset()
    db.user.findById.mockImplementation((id) => {
      const s = id.toString()
      if (s === adminUser._id.toString()) {
        return Promise.resolve(adminUser)
      }
      if (s === nonAdminUser._id.toString()) {
        return Promise.resolve(nonAdminUser)
      }
      return Promise.resolve(null)
    })

    db.user.findByName.mockReset()
    db.user.findByName.mockResolvedValue(null)

    db.user.create.mockReset()

    db.invite.create.mockReset()
    db.invite.findByToken.mockReset()
    db.invite.markUsed.mockReset()
    db.invite.markUsed.mockResolvedValue({ modifiedCount: 1 })
    db.invite.listActive.mockReset()
    db.invite.listActive.mockResolvedValue([])
  })

  describe('POST /api/admin/invite/create', () => {
    it('creates an invite for a new username', async () => {
      const inviteDoc = {
        token: 'tok-abc',
        username: 'newuser',
        createdBy: adminUser._id,
        createdAt: 1000,
        expiresAt: 1000 + 7 * 24 * 60 * 60 * 1000,
      }
      db.invite.create.mockResolvedValueOnce(inviteDoc)

      const response = await request(app)
        .post('/api/admin/invite/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: '  newuser  ', appVersion: APP_VERSION })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.invite).toEqual({
        token: 'tok-abc',
        username: 'newuser',
        createdAt: inviteDoc.createdAt,
        expiresAt: inviteDoc.expiresAt,
      })
      expect(db.user.findByName).toHaveBeenCalledWith('newuser')
      expect(db.invite.create).toHaveBeenCalledWith({
        username: 'newuser',
        createdBy: adminUser._id,
      })
    })

    it('rejects when the username already exists', async () => {
      db.user.findByName.mockResolvedValueOnce({ _id: new ObjectId(), name: 'taken' })

      const response = await request(app)
        .post('/api/admin/invite/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: 'taken', appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
      expect(response.body.message).toMatch(/already exists/)
      expect(db.invite.create).not.toHaveBeenCalled()
    })

    it('rejects when username is missing or empty', async () => {
      const missing = await request(app)
        .post('/api/admin/invite/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ appVersion: APP_VERSION })
      expect(missing.status).toBe(400)

      const empty = await request(app)
        .post('/api/admin/invite/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: '   ', appVersion: APP_VERSION })
      expect(empty.status).toBe(400)

      expect(db.invite.create).not.toHaveBeenCalled()
    })

    it('returns 403 for non-admin callers', async () => {
      const response = await request(app)
        .post('/api/admin/invite/create')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({ username: 'newuser', appVersion: APP_VERSION })

      expect(response.status).toBe(403)
      expect(db.invite.create).not.toHaveBeenCalled()
    })

    it('requires authentication', async () => {
      const response = await request(app)
        .post('/api/admin/invite/create')
        .send({ username: 'newuser', appVersion: APP_VERSION })

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/admin/invite/list', () => {
    it('returns active invites', async () => {
      const invites = [
        { token: 't1', username: 'a', createdAt: 1, expiresAt: 2, createdBy: adminUser._id },
        { token: 't2', username: 'b', createdAt: 3, expiresAt: 4, createdBy: adminUser._id },
      ]
      db.invite.listActive.mockResolvedValueOnce(invites)

      const response = await request(app)
        .post('/api/admin/invite/list')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ appVersion: APP_VERSION })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.invites).toEqual([
        { token: 't1', username: 'a', createdAt: 1, expiresAt: 2 },
        { token: 't2', username: 'b', createdAt: 3, expiresAt: 4 },
      ])
    })

    it('returns 403 for non-admin callers', async () => {
      const response = await request(app)
        .post('/api/admin/invite/list')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send({ appVersion: APP_VERSION })

      expect(response.status).toBe(403)
    })
  })

  describe('POST /api/guest/invite/validate', () => {
    it('returns valid:true with username for a fresh invite', async () => {
      const future = Date.now() + 1000 * 60 * 60
      db.invite.findByToken.mockResolvedValueOnce({
        token: 'tok-good',
        username: 'inviteduser',
        expiresAt: future,
      })

      const response = await request(app)
        .post('/api/guest/invite/validate')
        .send({ token: 'tok-good', appVersion: APP_VERSION })

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        status: 'success',
        valid: true,
        username: 'inviteduser',
        expiresAt: future,
      })
    })

    it('returns 400 when token is missing', async () => {
      const response = await request(app)
        .post('/api/guest/invite/validate')
        .send({ appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.status).toBe('error')
    })

    it('returns valid:false reason=not_found for unknown token', async () => {
      db.invite.findByToken.mockResolvedValueOnce(null)

      const response = await request(app)
        .post('/api/guest/invite/validate')
        .send({ token: 'nope', appVersion: APP_VERSION })

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({ valid: false, reason: 'not_found' })
    })

    it('returns valid:false reason=used for a used invite', async () => {
      db.invite.findByToken.mockResolvedValueOnce({
        token: 'tok-used',
        username: 'u',
        expiresAt: Date.now() + 10000,
        usedAt: Date.now() - 1000,
      })

      const response = await request(app)
        .post('/api/guest/invite/validate')
        .send({ token: 'tok-used', appVersion: APP_VERSION })

      expect(response.body).toMatchObject({ valid: false, reason: 'used' })
    })

    it('returns valid:false reason=expired for an expired invite', async () => {
      db.invite.findByToken.mockResolvedValueOnce({
        token: 'tok-old',
        username: 'u',
        expiresAt: Date.now() - 1000,
      })

      const response = await request(app)
        .post('/api/guest/invite/validate')
        .send({ token: 'tok-old', appVersion: APP_VERSION })

      expect(response.body).toMatchObject({ valid: false, reason: 'expired' })
    })
  })

  describe('POST /api/guest/invite/accept', () => {
    const validInvite = () => ({
      token: 'tok-good',
      username: 'inviteduser',
      expiresAt: Date.now() + 1000 * 60 * 60,
    })

    it('creates the user, marks the invite used, and returns user with token', async () => {
      db.invite.findByToken.mockResolvedValueOnce(validInvite())
      const createdUser = {
        _id: new ObjectId(),
        name: 'inviteduser',
        token: 'jwt-for-new-user',
      }
      db.user.create.mockResolvedValueOnce(createdUser)

      const response = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'tok-good', password: 'longenough', appVersion: APP_VERSION })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(response.body.user.name).toBe('inviteduser')
      expect(response.body.user.token).toBe('jwt-for-new-user')

      expect(db.user.create).toHaveBeenCalledWith({
        name: 'inviteduser',
        password: 'longenough',
      })
      expect(db.invite.markUsed).toHaveBeenCalledWith('tok-good')
    })

    it('rejects missing token or password', async () => {
      const noToken = await request(app)
        .post('/api/guest/invite/accept')
        .send({ password: 'longenough', appVersion: APP_VERSION })
      expect(noToken.status).toBe(400)

      const noPassword = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'tok-good', appVersion: APP_VERSION })
      expect(noPassword.status).toBe(400)

      expect(db.user.create).not.toHaveBeenCalled()
      expect(db.invite.markUsed).not.toHaveBeenCalled()
    })

    it('rejects short passwords', async () => {
      const response = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'tok-good', password: 'short', appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/at least 8 characters/)
      expect(db.user.create).not.toHaveBeenCalled()
      expect(db.invite.markUsed).not.toHaveBeenCalled()
    })

    it('rejects unknown tokens', async () => {
      db.invite.findByToken.mockResolvedValueOnce(null)

      const response = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'nope', password: 'longenough', appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/Invalid invite/)
      expect(db.user.create).not.toHaveBeenCalled()
    })

    it('rejects used invites', async () => {
      db.invite.findByToken.mockResolvedValueOnce({
        ...validInvite(),
        usedAt: Date.now() - 1000,
      })

      const response = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'tok-used', password: 'longenough', appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/already been used/)
      expect(db.user.create).not.toHaveBeenCalled()
      expect(db.invite.markUsed).not.toHaveBeenCalled()
    })

    it('rejects expired invites', async () => {
      db.invite.findByToken.mockResolvedValueOnce({
        ...validInvite(),
        expiresAt: Date.now() - 1000,
      })

      const response = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'tok-old', password: 'longenough', appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/expired/)
      expect(db.user.create).not.toHaveBeenCalled()
      expect(db.invite.markUsed).not.toHaveBeenCalled()
    })

    it('does not mark invite used if user creation fails', async () => {
      db.invite.findByToken.mockResolvedValueOnce(validInvite())
      db.user.create.mockRejectedValueOnce(new Error('User with name (inviteduser) already exists'))

      const response = await request(app)
        .post('/api/guest/invite/accept')
        .send({ token: 'tok-good', password: 'longenough', appVersion: APP_VERSION })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/already exists/)
      expect(db.invite.markUsed).not.toHaveBeenCalled()
    })
  })
})

const linkController = require('../../../../src/controllers/magic/link.controller')

// Mock dependencies
jest.mock('../../../../src/models/db', () => ({
  game: {
    linkGameToDraft: jest.fn(),
    linkDraftToGame: jest.fn(),
    collection: {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      project: jest.fn().mockReturnThis(),
      toArray: jest.fn()
    }
  }
}))

const db = require('../../../../src/models/db')

describe('Link Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {},
      draft: null,
      game: null
    }
    res = {
      json: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create links between game and draft and return success response', async () => {
      // Setup
      const mockDraft = { _id: '507f1f77bcf86cd799439011', name: 'Test Draft' }
      const mockGame = { _id: '507f1f77bcf86cd799439022', name: 'Test Game' }

      req.draft = mockDraft
      req.game = mockGame

      db.game.linkGameToDraft.mockResolvedValueOnce()
      db.game.linkDraftToGame.mockResolvedValueOnce()

      // Execute
      await linkController.create(req, res, next)

      // Verify
      expect(db.game.linkGameToDraft).toHaveBeenCalledWith(mockGame, mockDraft)
      expect(db.game.linkDraftToGame).toHaveBeenCalledWith(mockDraft, mockGame)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success'
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should return error when draft or game is missing', async () => {
      // Setup
      req.draft = null
      req.game = { _id: '507f1f77bcf86cd799439022', name: 'Test Game' }
      req.body = { gameId: '507f1f77bcf86cd799439022' }

      // Execute
      await linkController.create(req, res, next)

      // Verify
      expect(db.game.linkGameToDraft).not.toHaveBeenCalled()
      expect(db.game.linkDraftToGame).not.toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'unable to create link',
        requestBody: req.body
      })
      expect(next).toHaveBeenCalled()
    })
  })

  describe('fetchDrafts', () => {
    it('should fetch drafts for a user and return success response', async () => {
      // Setup
      const mockUserId = '507f1f77bcf86cd799439011'
      const mockDrafts = [
        { _id: '507f1f77bcf86cd799439022', name: 'Draft 1' },
        { _id: '507f1f77bcf86cd799439033', name: 'Draft 2' }
      ]

      req.body.userId = mockUserId

      db.game.collection.find.mockReturnThis()
      db.game.collection.sort.mockReturnThis()
      db.game.collection.toArray.mockResolvedValueOnce(mockDrafts)

      // Execute
      await linkController.fetchDrafts(req, res)

      // Verify
      expect(db.game.collection.find).toHaveBeenCalledWith({
        'settings.game': 'CubeDraft',
        'settings.players': { $elemMatch: { _id: mockUserId } },
        killed: { $ne: true }
      })
      expect(db.game.collection.sort).toHaveBeenCalledWith({
        lastUpdated: -1
      })
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        drafts: mockDrafts
      })
    })
  })

  describe('fetchByDraft', () => {
    it('should fetch games linked to a draft and return success response', async () => {
      // Setup
      const mockDraft = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Draft',
        responses: { some: 'data' }
      }
      const mockGames = [
        { _id: '507f1f77bcf86cd799439022', name: 'Game 1' },
        { _id: '507f1f77bcf86cd799439033', name: 'Game 2' }
      ]

      req.draft = { ...mockDraft }

      db.game.collection.find.mockReturnThis()
      db.game.collection.project.mockReturnThis()
      db.game.collection.toArray.mockResolvedValueOnce(mockGames)

      // Execute
      await linkController.fetchByDraft(req, res)

      // Verify
      expect(db.game.collection.find).toHaveBeenCalledWith({
        'settings.linkedDraftId': mockDraft._id
      })
      expect(db.game.collection.project).toHaveBeenCalledWith({
        responses: 0
      })
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        games: mockGames,
        draft: { _id: mockDraft._id, name: mockDraft.name } // Without responses
      })
      expect(req.draft.responses).toBeUndefined() // The responses should be deleted
    })
  })
})

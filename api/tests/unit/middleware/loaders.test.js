const { loadGameArgs, loadLobbyArgs, loadDraftArgs, loadCardArgs, loadCubeArgs, loadDeckArgs, GameOverwriteError, GameKilledError } = require('../../../src/middleware/loaders')
const { NotFoundError } = require('../../../src/utils/errors')
const { ObjectId } = require('mongodb')

// Mock AsyncLock
jest.mock('async-lock', () => {
  return jest.fn().mockImplementation(() => {
    return {
      acquire: jest.fn((key, fn) => {
        return Promise.resolve(fn())
      })
    }
  })
})

// Mock db
jest.mock('../../../src/models/db', () => ({
  game: {
    findById: jest.fn()
  },
  lobby: {
    findById: jest.fn()
  },
  magic: {
    card: {
      findById: jest.fn(),
      findByIds: jest.fn().mockResolvedValue([])
    },
    cube: {
      findById: jest.fn()
    },
    deck: {
      findById: jest.fn()
    }
  }
}))

// Mock fromData from common
jest.mock('battlestar-common', () => ({
  fromData: jest.fn(data => data)
}))

const db = require('../../../src/models/db')
const { fromData } = require('battlestar-common')

describe('Data Loader Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: {}
    }
    res = {
      locals: {},
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          // Simulate the callback being called
          callback()
        }
      })
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('loadGameArgs', () => {
    it('should load game and set it on the request object', async () => {
      // Setup
      const gameId = new ObjectId()
      req.body.gameId = gameId
      const mockGame = { _id: gameId, name: 'Test Game' }
      db.game.findById.mockResolvedValue(mockGame)

      // Execute
      await loadGameArgs(req, res, next)

      // Verify
      expect(db.game.findById).toHaveBeenCalledWith(gameId)
      expect(fromData).toHaveBeenCalledWith(mockGame)
      expect(req.game).toEqual(mockGame)
      expect(next).toHaveBeenCalled()
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    })

    it('should call next with NotFoundError if game is not found', async () => {
      // Setup
      const gameId = new ObjectId()
      req.body.gameId = gameId
      db.game.findById.mockResolvedValue(null)

      // Execute
      await loadGameArgs(req, res, next)

      // Verify
      expect(db.game.findById).toHaveBeenCalledWith(gameId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain(gameId.toString())
    })

    it('should just call next if no gameId is provided', async () => {
      // Setup
      req.body.gameId = null

      // Execute
      await loadGameArgs(req, res, next)

      // Verify
      expect(db.game.findById).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0]).toBeUndefined()
    })
  })

  describe('loadLobbyArgs', () => {
    it('should load lobby and set it on the request object', async () => {
      // Setup
      const lobbyId = new ObjectId()
      req.body.lobbyId = lobbyId
      const mockLobby = { _id: lobbyId, name: 'Test Lobby' }
      db.lobby.findById.mockResolvedValue(mockLobby)

      // Execute
      await loadLobbyArgs(req, res, next)

      // Verify
      expect(db.lobby.findById).toHaveBeenCalledWith(lobbyId)
      expect(req.lobby).toEqual(mockLobby)
      expect(next).toHaveBeenCalled()
    })

    it('should call next with NotFoundError if lobby is not found', async () => {
      // Setup
      const lobbyId = new ObjectId()
      req.body.lobbyId = lobbyId
      db.lobby.findById.mockResolvedValue(null)

      // Execute
      await loadLobbyArgs(req, res, next)

      // Verify
      expect(db.lobby.findById).toHaveBeenCalledWith(lobbyId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain('lobby not found')
    })
  })

  describe('loadDraftArgs', () => {
    it('should load draft (which is a game) and set it on the request object', async () => {
      // Setup
      const draftId = new ObjectId()
      req.body.draftId = draftId
      const mockDraft = { _id: draftId, name: 'Test Draft' }
      db.game.findById.mockResolvedValue(mockDraft)

      // Execute
      await loadDraftArgs(req, res, next)

      // Verify
      expect(db.game.findById).toHaveBeenCalledWith(draftId)
      expect(fromData).toHaveBeenCalledWith(mockDraft)
      expect(req.draft).toEqual(mockDraft)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('loadCardArgs', () => {
    it('should load card and set it on the request object', async () => {
      // Setup
      const cardId = new ObjectId()
      req.body.cardId = cardId
      const mockCard = { _id: cardId, name: 'Test Card' }
      db.magic.card.findById.mockResolvedValue(mockCard)

      // Execute
      await loadCardArgs(req, res, next)

      // Verify
      expect(db.magic.card.findById).toHaveBeenCalledWith(cardId)
      expect(req.card).toEqual(mockCard)
      expect(next).toHaveBeenCalled()
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    })

    it('should call next with NotFoundError if card is not found', async () => {
      // Setup
      const cardId = new ObjectId()
      req.body.cardId = cardId
      db.magic.card.findById.mockResolvedValue(null)

      // Execute
      await loadCardArgs(req, res, next)

      // Verify
      expect(db.magic.card.findById).toHaveBeenCalledWith(cardId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain('card not found')
    })

    it('should just call next if no cardId is provided', async () => {
      // Setup
      req.body.cardId = null

      // Execute
      await loadCardArgs(req, res, next)

      // Verify
      expect(db.magic.card.findById).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0]).toBeUndefined()
    })
  })

  describe('loadCubeArgs', () => {
    it('should load cube and set it on the request object', async () => {
      // Setup
      const cubeId = new ObjectId('68026d3e7dbcbab90d49ee65')
      req.body.cubeId = cubeId
      const mockCube = { _id: cubeId, name: 'Test Cube', cardlist: [] }

      // When calling findById, return the mock cube
      db.magic.cube.findById.mockResolvedValueOnce(mockCube)

      // For card loading, return empty array
      db.magic.card.findByIds.mockResolvedValueOnce([])

      // Execute
      await loadCubeArgs(req, res, next)

      // Verify
      expect(db.magic.cube.findById).toHaveBeenCalledWith(cubeId)

      // Expect that the cube is assigned to req.cube
      // with cards property added by the loader
      expect(req.cube).toEqual({...mockCube, cards: []})

      expect(next).toHaveBeenCalled()
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    })

    it('should call next with NotFoundError if cube is not found', async () => {
      // Setup
      const cubeId = new ObjectId('68026d3e7dbcbab90d49ee66')
      req.body.cubeId = cubeId
      db.magic.cube.findById.mockResolvedValueOnce(null)

      // Execute
      await loadCubeArgs(req, res, next)

      // Verify
      expect(db.magic.cube.findById).toHaveBeenCalledWith(cubeId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain('Cube not found')
    })

    it('should just call next if no cubeId is provided', async () => {
      // Setup
      req.body.cubeId = null

      // Execute
      await loadCubeArgs(req, res, next)

      // Verify
      expect(db.magic.cube.findById).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0]).toBeUndefined()
    })
  })

  describe('loadDeckArgs', () => {
    it('should load deck and set it on the request object', async () => {
      // Setup
      const deckId = new ObjectId()
      req.body.deckId = deckId
      const mockDeck = { _id: deckId, name: 'Test Deck' }
      db.magic.deck.findById.mockResolvedValue(mockDeck)

      // Execute
      await loadDeckArgs(req, res, next)

      // Verify
      expect(db.magic.deck.findById).toHaveBeenCalledWith(deckId)
      expect(req.deck).toEqual(mockDeck)
      expect(next).toHaveBeenCalled()
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function))
    })

    it('should call next with NotFoundError if deck is not found', async () => {
      // Setup
      const deckId = new ObjectId()
      req.body.deckId = deckId
      db.magic.deck.findById.mockResolvedValue(null)

      // Execute
      await loadDeckArgs(req, res, next)

      // Verify
      expect(db.magic.deck.findById).toHaveBeenCalledWith(deckId)
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
      expect(next.mock.calls[0][0].message).toContain('deck not found')
    })

    it('should just call next if no deckId is provided', async () => {
      // Setup
      req.body.deckId = null

      // Execute
      await loadDeckArgs(req, res, next)

      // Verify
      expect(db.magic.deck.findById).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0]).toBeUndefined()
    })
  })

  describe('Error classes', () => {
    it('GameOverwriteError should have correct properties', () => {
      const error = new GameOverwriteError('Test message')
      expect(error.name).toBe('GameOverwriteError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('game_overwrite')
      expect(error.statusCode).toBe(409)
    })

    it('GameOverwriteError should use default message if none provided', () => {
      const error = new GameOverwriteError()
      expect(error.message).toBe('game overwrite')
    })

    it('GameKilledError should have correct properties', () => {
      const error = new GameKilledError('Test message')
      expect(error.name).toBe('GameKilledError')
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('game_killed')
      expect(error.statusCode).toBe(409)
    })

    it('GameKilledError should use default message if none provided', () => {
      const error = new GameKilledError()
      expect(error.message).toBe('game killed')
    })
  })
})

const gameController = require('../../../src/controllers/game.controller');
const { NotFoundError } = require('../../../src/utils/errors');
const { ObjectId } = require('mongodb');

// Mock db
jest.mock('../../../src/models/db', () => ({
  game: {
    create: jest.fn(),
    find: jest.fn(() => ({
      toArray: jest.fn().mockResolvedValue([
        { _id: 'game1', name: 'Test Game 1' },
        { _id: 'game2', name: 'Test Game 2' }
      ])
    })),
    findById: jest.fn()
  }
}));

const db = require('../../../src/models/db');

describe('Game Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      game: null
    };
    res = {
      json: jest.fn()
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new game and return the result', async () => {
      // Setup
      const newGame = { _id: new ObjectId(), name: 'New Game' };
      req.body = { name: 'New Game', players: ['player1', 'player2'] };
      db.game.create.mockResolvedValue(newGame);

      // Execute
      await gameController.create(req, res, next);

      // Verify
      expect(db.game.create).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(newGame);
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass errors to the next middleware', async () => {
      // Setup
      const error = new Error('Database error');
      db.game.create.mockRejectedValue(error);

      // Execute
      await gameController.create(req, res, next);

      // Verify
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('fetchAll', () => {
    it('should return all games', async () => {
      // Execute
      await gameController.fetchAll(req, res, next);

      // Verify
      expect(db.game.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith([
        { _id: 'game1', name: 'Test Game 1' },
        { _id: 'game2', name: 'Test Game 2' }
      ]);
    });

    it('should pass errors to the next middleware', async () => {
      // Setup
      const error = new Error('Database error');
      db.game.find.mockImplementationOnce(() => {
        throw error;
      });

      // Execute
      await gameController.fetchAll(req, res, next);

      // Verify
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('fetch', () => {
    it('should return the game if it exists in the request', async () => {
      // Setup
      const game = { _id: 'game1', name: 'Test Game' };
      req.game = game;

      // Execute
      await gameController.fetch(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith(game);
    });

    it('should return a NotFoundError if game is not in the request', async () => {
      // Setup
      req.game = null;

      // Execute
      await gameController.fetch(req, res, next);

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(next.mock.calls[0][0].message).toBe('Game not found');
    });
  });

  describe('kill', () => {
    it('should kill a game and return success', async () => {
      // Execute
      await gameController.kill(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('rematch', () => {
    it('should handle rematch and return success', async () => {
      // Execute
      await gameController.rematch(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('saveFull', () => {
    it('should save the full game and return success', async () => {
      // Execute
      await gameController.saveFull(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('saveResponse', () => {
    it('should save the game response and return success', async () => {
      // Execute
      await gameController.saveResponse(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('undo', () => {
    it('should undo a game action and return success', async () => {
      // Execute
      await gameController.undo(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('stats.innovation', () => {
    it('should return innovation stats', async () => {
      // Execute
      await gameController.stats.innovation(req, res, next);

      // Verify
      expect(res.json).toHaveBeenCalledWith({ stats: [] });
    });
  });
}); 
// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

// Mock db
jest.mock('../../../src/models/db', () => ({
  game: {
    findById: jest.fn().mockResolvedValue({ _id: 'game1', name: 'Test Game' })
  },
  snapshot: {
    create: jest.fn().mockResolvedValue(true),
    findByGameId: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { _id: 'snapshot1', gameId: 'game1', data: { someField: 'value1' } },
        { _id: 'snapshot2', gameId: 'game1', data: { someField: 'value2' } }
      ])
    })
  }
}));

// Import after mocks are set up
const snapshotController = require('../../../src/controllers/snapshot.controller');
const { BadRequestError, NotFoundError } = require('../../../src/utils/errors');
const db = require('../../../src/models/db');
const logger = require('../../../src/utils/logger');

describe('Snapshot Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('createSnapshot', () => {
    it('should create a snapshot for a valid game ID', async () => {
      // Setup
      req.body = { gameId: 'game1' };

      // Execute
      await snapshotController.createSnapshot(req, res, next);

      // Verify
      expect(db.game.findById).toHaveBeenCalledWith('game1');
      expect(db.snapshot.create).toHaveBeenCalledWith(expect.objectContaining({ 
        _id: 'game1', 
        name: 'Test Game' 
      }));
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Snapshot created'
      });
    });

    it('should return BadRequestError if gameId is missing', async () => {
      // Setup
      req.body = {}; // Missing gameId

      // Execute
      await snapshotController.createSnapshot(req, res, next);

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(db.snapshot.create).not.toHaveBeenCalled();
    });

    it('should return NotFoundError if game is not found', async () => {
      // Setup
      req.body = { gameId: 'nonexistent' };
      db.game.findById.mockResolvedValueOnce(null);

      // Execute
      await snapshotController.createSnapshot(req, res, next);

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(db.snapshot.create).not.toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      // Setup
      req.body = { gameId: 'game1' };
      const error = new Error('Database error');
      db.game.findById.mockRejectedValueOnce(error);

      // Execute
      await snapshotController.createSnapshot(req, res, next);

      // Verify
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSnapshots', () => {
    it('should return snapshots for a game ID', async () => {
      // Setup
      req.body = { gameId: 'game1' };

      // Execute
      await snapshotController.getSnapshots(req, res, next);

      // Verify
      expect(db.snapshot.findByGameId).toHaveBeenCalledWith('game1');
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        snapshots: expect.arrayContaining([
          expect.objectContaining({ _id: 'snapshot1' }),
          expect.objectContaining({ _id: 'snapshot2' })
        ])
      });
    });

    it('should return BadRequestError if gameId is missing', async () => {
      // Setup
      req.body = {}; // Missing gameId

      // Execute
      await snapshotController.getSnapshots(req, res, next);

      // Verify
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(db.snapshot.findByGameId).not.toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      // Setup
      req.body = { gameId: 'game1' };
      const error = new Error('Database error');
      db.snapshot.findByGameId.mockRejectedValueOnce(error);

      // Execute
      await snapshotController.getSnapshots(req, res, next);

      // Verify
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
}); 
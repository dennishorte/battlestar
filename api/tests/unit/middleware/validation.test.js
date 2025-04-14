const { coerceMongoIds, ensureVersion } = require('../../../src/middleware/validation');
const { ObjectId } = require('mongodb');

// Mock version module
jest.mock('../../../src/version', () => '1.2.3');

describe('Validation Middleware', () => {
  describe('coerceMongoIds', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {};
      next = jest.fn();
    });

    it('should convert string ids to ObjectId', () => {
      // Setup
      req.body = {
        userId: '507f1f77bcf86cd799439011',
        gameIds: ['507f191e810c19729de860ea', '507f191e810c19729de860eb'],
        nested: {
          lobbyId: '507f191e810c19729de860ec'
        },
        normalField: 'just a string'
      };
      
      // Execute
      coerceMongoIds(req, res, next);
      
      // Verify
      expect(req.body.userId).toBeInstanceOf(ObjectId);
      expect(req.body.userId.toString()).toBe('507f1f77bcf86cd799439011');
      
      expect(req.body.gameIds[0]).toBeInstanceOf(ObjectId);
      expect(req.body.gameIds[0].toString()).toBe('507f191e810c19729de860ea');
      expect(req.body.gameIds[1]).toBeInstanceOf(ObjectId);
      
      expect(req.body.nested.lobbyId).toBeInstanceOf(ObjectId);
      expect(req.body.nested.lobbyId.toString()).toBe('507f191e810c19729de860ec');
      
      // Normal fields should be unchanged
      expect(req.body.normalField).toBe('just a string');
      
      expect(next).toHaveBeenCalled();
    });
    
    it('should not convert non-MongoDB-id strings', () => {
      // Setup
      req.body = {
        userId: 'not-a-mongo-id',
        someId: 'abcdefghijklmnopqrstuvwx', // 24 chars but not hex
        normal: 'value'
      };
      
      // Execute
      coerceMongoIds(req, res, next);
      
      // Verify - all should remain as strings
      expect(req.body.userId).toBe('not-a-mongo-id');
      expect(req.body.someId).toBe('abcdefghijklmnopqrstuvwx');
      expect(req.body.normal).toBe('value');
      
      expect(next).toHaveBeenCalled();
    });
    
    it('should handle array elements that are objects', () => {
      // Setup
      req.body = {
        items: [
          { itemId: '507f191e810c19729de860ea', name: 'Item 1' },
          { itemId: '507f191e810c19729de860eb', name: 'Item 2' }
        ]
      };
      
      // Execute
      coerceMongoIds(req, res, next);
      
      // Verify
      expect(req.body.items[0].itemId).toBeInstanceOf(ObjectId);
      expect(req.body.items[1].itemId).toBeInstanceOf(ObjectId);
      expect(req.body.items[0].name).toBe('Item 1');
      
      expect(next).toHaveBeenCalled();
    });
    
    it('should handle null or undefined values', () => {
      // Setup
      req.body = {
        userId: null,
        gameId: undefined,
        nested: {
          lobbyId: null
        }
      };
      
      // Execute
      coerceMongoIds(req, res, next);
      
      // Verify - all should remain null/undefined
      expect(req.body.userId).toBeNull();
      expect(req.body.gameId).toBeUndefined();
      expect(req.body.nested.lobbyId).toBeNull();
      
      expect(next).toHaveBeenCalled();
    });
    
    it('should handle complex nested structures', () => {
      // Setup
      req.body = {
        user: {
          _id: '507f1f77bcf86cd799439011',
          profile: {
            favoriteGameIds: ['507f191e810c19729de860ea', '507f191e810c19729de860eb']
          }
        },
        games: [
          { 
            gameId: '507f191e810c19729de860ec',
            players: [
              { playerId: '507f1f77bcf86cd799439011' },
              { playerId: '507f1f77bcf86cd799439012' }
            ]
          }
        ]
      };
      
      // Execute
      coerceMongoIds(req, res, next);
      
      // Verify
      expect(req.body.user._id).toBeInstanceOf(ObjectId);
      expect(req.body.user.profile.favoriteGameIds[0]).toBeInstanceOf(ObjectId);
      expect(req.body.games[0].gameId).toBeInstanceOf(ObjectId);
      expect(req.body.games[0].players[0].playerId).toBeInstanceOf(ObjectId);
      expect(req.body.games[0].players[1].playerId).toBeInstanceOf(ObjectId);
      
      expect(next).toHaveBeenCalled();
    });
  });
  
  describe('ensureVersion', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should call next when version matches exactly', () => {
      // Setup
      req.body.appVersion = '1.2.3';
      
      // Execute
      ensureVersion(req, res, next);
      
      // Verify
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return version mismatch error when version does not match', () => {
      // Setup
      req.body.appVersion = '1.0.0';
      
      // Execute
      ensureVersion(req, res, next);
      
      // Verify
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        code: 'version_mismatch',
        currentVersion: '1.0.0',
        latestVersion: '1.2.3'
      });
    });
    
    it('should return version mismatch error when no version is provided', () => {
      // Setup
      req.body.appVersion = undefined;
      
      // Execute
      ensureVersion(req, res, next);
      
      // Verify
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        code: 'version_mismatch',
        currentVersion: undefined,
        latestVersion: '1.2.3'
      });
    });
  });
}); 
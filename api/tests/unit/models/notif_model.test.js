const Notif = require('../../../src/models/notif_models.js');
const mongodb = require('../../../src/utils/mongo');

// Mock the MongoDB module
jest.mock('../../../src/utils/mongo', () => {
  const deleteManySpy = jest.fn().mockResolvedValue({ deletedCount: 2 });
  const deleteOneSpy = jest.fn().mockResolvedValue({ deletedCount: 1 });
  const findOneSpy = jest.fn();
  const updateOneSpy = jest.fn().mockResolvedValue({ modifiedCount: 1 });

  return {
    client: {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          deleteMany: deleteManySpy,
          deleteOne: deleteOneSpy,
          findOne: findOneSpy,
          updateOne: updateOneSpy
        })
      })
    },
    // Expose the spies for test assertions
    __mocks__: {
      deleteMany: deleteManySpy,
      deleteOne: deleteOneSpy,
      findOne: findOneSpy,
      updateOne: updateOneSpy
    }
  };
});

describe('Notification Throttle Model', () => {
  const mockUser = { _id: 'user123' };
  const mockGame = { _id: 'game456' };
  const mockKey = { userId: 'user123', gameId: 'game456' };

  beforeEach(() => {
    // Clear all mock calls between tests
    jest.clearAllMocks();
  });

  describe('clean()', () => {
    it('should delete notification throttles older than the cutoff', async () => {
      await Notif.clean();

      const oneHour = 1000 * 60 * 60;
      const expected = { createdAt: { $lt: expect.any(Number) } };

      expect(mongodb.__mocks__.deleteMany).toHaveBeenCalledTimes(1);
      expect(mongodb.__mocks__.deleteMany.mock.calls[0][0]).toMatchObject(expected);

      // Check that the time difference is approximately one hour
      const actualTime = Date.now() - mongodb.__mocks__.deleteMany.mock.calls[0][0].createdAt.$lt;
      expect(Math.abs(actualTime - oneHour)).toBeLessThan(100); // Allow for slight timing differences
    });
  });

  describe('clear()', () => {
    it('should delete a specific notification throttle', async () => {
      await Notif.clear(mockUser, mockGame);

      expect(mongodb.__mocks__.deleteOne).toHaveBeenCalledTimes(1);
      expect(mongodb.__mocks__.deleteOne).toHaveBeenCalledWith(mockKey);
    });
  });

  describe('throttleOrSet()', () => {
    it('should return false and create a new throttle if one does not exist', async () => {
      // Mock findOne to return null (no existing throttle)
      mongodb.__mocks__.findOne.mockResolvedValueOnce(null);

      const result = await Notif.throttleOrSet(mockUser, mockGame);

      expect(result).toBe(false);
      expect(mongodb.__mocks__.findOne).toHaveBeenCalledWith(mockKey);
      expect(mongodb.__mocks__.updateOne).toHaveBeenCalledWith(
        mockKey,
        { $set: { createdAt: expect.any(Number) } },
        { upsert: true }
      );
    });

    it('should return true if a recent throttle exists', async () => {
      // Mock findOne to return a recent throttle (less than cutoff time)
      const recentTime = Date.now() - (1000 * 60 * 30); // 30 minutes ago
      mongodb.__mocks__.findOne.mockResolvedValueOnce({
        ...mockKey,
        createdAt: recentTime
      });

      const result = await Notif.throttleOrSet(mockUser, mockGame);

      expect(result).toBe(true);
      expect(mongodb.__mocks__.findOne).toHaveBeenCalledWith(mockKey);
      expect(mongodb.__mocks__.updateOne).not.toHaveBeenCalled();
    });

    it('should return false and update throttle if an old throttle exists', async () => {
      // Mock findOne to return an old throttle (more than cutoff time)
      const oldTime = Date.now() - (1000 * 60 * 90); // 90 minutes ago
      mongodb.__mocks__.findOne.mockResolvedValueOnce({
        ...mockKey,
        createdAt: oldTime
      });

      const result = await Notif.throttleOrSet(mockUser, mockGame);

      expect(result).toBe(false);
      expect(mongodb.__mocks__.findOne).toHaveBeenCalledWith(mockKey);
      expect(mongodb.__mocks__.updateOne).toHaveBeenCalledWith(
        mockKey,
        { $set: { createdAt: expect.any(Number) } },
        { upsert: true }
      );
    });
  });
}); 
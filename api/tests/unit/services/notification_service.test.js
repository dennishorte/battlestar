import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'
import notificationService from '../../../src/services/notification_service.js'

// Mock dependencies
vi.mock('../../../src/models/db.js', () => {
  return {
    default: {
      notif: {
        clear: vi.fn().mockResolvedValue(),
        throttleOrSet: vi.fn()
      },
      user: {
        findById: vi.fn(id => Promise.resolve({ _id: id }))
      }
    }
  }
})

vi.mock('../../../src/notifications/index.js', () => {
  return {
    default: {
      send: vi.fn()
    }
  }
})

// Import mocked dependencies for assertions
import db from '../../../src/models/db.js'
import notifications from '../../../src/notifications/index.js'

describe('Notification Service', () => {
  // Store original environment variables
  const originalEnv = process.env

  // Create reusable mock data
  const mockUser1 = { _id: 'user1' }
  const mockUser2 = { _id: 'user2' }
  const mockGameId = 'game123'

  // Setup mock game with different behaviors
  const createMockGame = (config) => ({
    _id: mockGameId,
    settings: {
      game: 'testgame',
      name: 'Test Game',
      players: [mockUser1, mockUser2]
    },
    checkIsNewGame: vi.fn().mockReturnValue(config.isNewGame || false),
    checkGameIsOver: vi.fn().mockReturnValue(config.isGameOver || false),
    checkLastActorWas: vi.fn(user => user._id === (config.lastActor || null)),
    checkPlayerHasActionWaiting: vi.fn(user => config.playersWithActionWaiting?.includes(user._id) || false),
    getResultMessage: vi.fn().mockReturnValue('Player 1 won!')
  })

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup environment to production by default for tests
    process.env = { ...originalEnv, NODE_ENV: 'production', DOMAIN_HOST: 'example.com' }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('sendGameNotifications', () => {
    it('should send game over notifications to all players when game is over', async () => {
      // Setup
      const mockGame = createMockGame({
        isGameOver: true
      })

      // Execute
      await notificationService.sendGameNotifications(mockGame)

      // Verify
      expect(db.notif.clear).toHaveBeenCalledTimes(2)
      expect(db.notif.clear).toHaveBeenCalledWith(mockUser1, mockGame)
      expect(db.notif.clear).toHaveBeenCalledWith(mockUser2, mockGame)

      expect(notifications.send).toHaveBeenCalledTimes(2)
      expect(notifications.send).toHaveBeenNthCalledWith(
        1,
        mockUser1,
        expect.objectContaining({
          text: 'Game over!',
          url: expect.stringContaining('game123'),
          urlTitle: 'testgame: Test Game',
          suffix: 'Player 1 won!',
        })
      )
      expect(notifications.send).toHaveBeenNthCalledWith(
        2,
        mockUser2,
        expect.objectContaining({
          text: 'Game over!',
        })
      )
    })

    it('should clear notification throttle when a user just finished their turn', async () => {
      // Setup
      const mockGame = createMockGame({
        lastActor: 'user1',
        playersWithActionWaiting: ['user2'] // User1 just finished, now user2's turn
      })

      // Execute
      await notificationService.sendGameNotifications(mockGame)

      // Verify
      expect(db.notif.clear).toHaveBeenCalledTimes(1)
      expect(db.notif.clear).toHaveBeenCalledWith(mockUser1, mockGame)
      expect(notifications.send).not.toHaveBeenCalledWith(mockUser1, expect.anything())
    })

    it('should send "your turn" notification if it is user\'s turn and not throttled', async () => {
      // Setup
      const mockGame = createMockGame({
        playersWithActionWaiting: ['user1'] // User1's turn
      })

      // Not throttled
      db.notif.throttleOrSet.mockResolvedValueOnce(false)

      // Execute
      await notificationService.sendGameNotifications(mockGame)

      // Verify
      expect(db.notif.throttleOrSet).toHaveBeenCalledWith(mockUser1, mockGame)
      expect(notifications.send).toHaveBeenCalledWith(
        mockUser1,
        expect.objectContaining({
          text: "You're up!",
          url: expect.stringContaining('game123'),
          urlTitle: 'testgame: Test Game',
        })
      )
      // User2 shouldn't get a notification
      expect(notifications.send).not.toHaveBeenCalledWith(mockUser2, expect.anything())
    })

    it('should not send "your turn" notification if it is throttled', async () => {
      // Setup
      const mockGame = createMockGame({
        playersWithActionWaiting: ['user1'] // User1's turn
      })

      // Throttled
      db.notif.throttleOrSet.mockResolvedValueOnce(true)

      // Execute
      await notificationService.sendGameNotifications(mockGame)

      // Verify
      expect(db.notif.throttleOrSet).toHaveBeenCalledWith(mockUser1, mockGame)
      // No notifications should be sent
      expect(notifications.send).not.toHaveBeenCalled()
    })

    it('should handle multiple players with different states correctly', async () => {
      // Setup a more complex game scenario
      const mockGame = createMockGame({
        lastActor: 'user2',         // User2 just made a move
        playersWithActionWaiting: ['user1'] // Now it's User1's turn
      })

      // User1 is not throttled
      db.notif.throttleOrSet.mockResolvedValueOnce(false)

      // Execute
      await notificationService.sendGameNotifications(mockGame)

      // Verify
      // User2 should have their throttle cleared (just finished turn)
      expect(db.notif.clear).toHaveBeenCalledWith(mockUser2, mockGame)

      // User1 should get a notification (their turn and not throttled)
      expect(db.notif.throttleOrSet).toHaveBeenCalledWith(mockUser1, mockGame)
      expect(notifications.send).toHaveBeenCalledWith(
        mockUser1,
        expect.objectContaining({
          text: "You're up!",
        })
      )

      // User2 shouldn't get a notification
      expect(notifications.send).not.toHaveBeenCalledWith(mockUser2, expect.anything())
    })
  })
})

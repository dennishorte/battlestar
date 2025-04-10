const notificationService = require('./notification_service.js')

// Mock dependencies
jest.mock('../models/db', () => ({
  notif: {
    clear: jest.fn().mockResolvedValue(),
    throttleOrSet: jest.fn()
  }
}))

jest.mock('../util/slack', () => ({
  sendMessage: jest.fn()
}))

// Import mocked dependencies for assertions
const db = require('../models/db')
const slack = require('../util/slack')

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
    checkIsNewGame: jest.fn().mockReturnValue(config.isNewGame || false),
    checkGameIsOver: jest.fn().mockReturnValue(config.isGameOver || false),
    checkLastActorWas: jest.fn(user => user._id === (config.lastActor || null)),
    checkPlayerHasActionWaiting: jest.fn(user => config.playersWithActionWaiting?.includes(user._id) || false),
    getResultMessage: jest.fn().mockReturnValue('Player 1 won!')
  })

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Setup environment to production by default for tests
    process.env = { ...originalEnv, NODE_ENV: 'production', DOMAIN_HOST: 'example.com' }
  })

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('sendGameNotifications', () => {
    it('should not send notifications in non-production environments', async () => {
      // Setup
      process.env.NODE_ENV = 'development'
      const mockGame = createMockGame({
        isGameOver: true
      })

      // Execute
      await notificationService.sendGameNotifications(mockGame)

      // Verify
      expect(slack.sendMessage).not.toHaveBeenCalled()
      expect(db.notif.clear).not.toHaveBeenCalled()
      expect(db.notif.throttleOrSet).not.toHaveBeenCalled()
    })

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

      expect(slack.sendMessage).toHaveBeenCalledTimes(2)
      expect(slack.sendMessage).toHaveBeenCalledWith(
        'user1',
        expect.stringContaining('Game over!')
      )
      expect(slack.sendMessage).toHaveBeenCalledWith(
        'user2',
        expect.stringContaining('Game over!')
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
      expect(slack.sendMessage).not.toHaveBeenCalledWith('user1', expect.anything())
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
      expect(slack.sendMessage).toHaveBeenCalledWith(
        'user1',
        expect.stringContaining('You\'re up!')
      )
      // User2 shouldn't get a notification
      expect(slack.sendMessage).not.toHaveBeenCalledWith('user2', expect.anything())
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
      expect(slack.sendMessage).not.toHaveBeenCalled()
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
      expect(slack.sendMessage).toHaveBeenCalledWith(
        'user1',
        expect.stringContaining('You\'re up!')
      )

      // User2 shouldn't get a notification
      expect(slack.sendMessage).not.toHaveBeenCalledWith('user2', expect.anything())
    })
  })
})

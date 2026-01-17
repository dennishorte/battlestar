const { GameFactory } = require('../game.js')

/**
 * Test fixture for BaseActionManager and related game component tests.
 * Creates a minimal but functional Game instance with proper setup.
 *
 * This fixture can be extended and customized for different test scenarios
 * while maintaining consistency across the test suite.
 */
class GameTestFixture {
  constructor(options = {}) {
    this.options = {
      name: 'test_game',
      seed: 'test_seed',
      players: [
        { _id: 'player1_id', name: 'player1' },
        { _id: 'player2_id', name: 'player2' }
      ],
      ...options
    }

    this.game = null
    this.queuedResponses = []
    this.originalMethods = {}
  }

  /**
   * Creates and sets up the game instance.
   * @returns - Fluent interface
   */
  setup() {
    this.game = GameFactory(this.options, 'player1')

    // Override _mainProgram to prevent normal game flow during tests
    this.game._mainProgram = () => {
      // Empty main program for testing
    }

    // Set up basic game state
    this.game._reset()

    return this
  }

  /**
   * Mock the input request system to use queued responses.
   * @returns - Fluent interface
   */
  mockInputRequests() {
    // Store original method for potential restoration
    this.originalMethods.requestInputSingle = this.game.requestInputSingle.bind(this.game)

    this.game.requestInputSingle = (selector) => {
      if (this.queuedResponses.length === 0) {
        throw new Error(`No queued response available for selector: ${JSON.stringify(selector, null, 2)}`)
      }

      const response = this.queuedResponses.shift()

      // Validate that the response actor matches the selector actor
      if (response.actor !== selector.actor) {
        throw new Error(`Response actor '${response.actor}' doesn't match selector actor '${selector.actor}'`)
      }

      return response.selection
    }

    return this
  }

  /**
   * Queue a response that will be returned when the game requests input.
   * @param actor - The player name making the selection
   * @param selection - The selection array
   * @returns - Fluent interface
   */
  queueResponse(actor, selection) {
    this.queuedResponses.push({
      actor: actor.name || actor,
      selection,
      isUserResponse: true
    })
    return this
  }

  /**
   * Queue multiple responses at once.
   * @param responses - Array of {actor, selection} objects
   * @returns - Fluent interface
   */
  queueResponses(responses) {
    responses.forEach(response => this.queueResponse(response.actor, response.selection))
    return this
  }

  /**
   * Get a player by name.
   * @param name - Player name
   * @returns - Player object
   */
  getPlayer(name) {
    const player = this.game.players.byName(name)
    if (!player) {
      throw new Error(`Player '${name}' not found. Available players: ${this.game.players.all().map(p => p.name).join(', ')}`)
    }
    return player
  }

  /**
   * Get the first player for convenience.
   * @returns - Player object
   */
  getPlayer1() {
    return this.getPlayer('player1')
  }

  /**
   * Get the second player for convenience.
   * @returns - Player object
   */
  getPlayer2() {
    return this.getPlayer('player2')
  }

  /**
   * Create mock cards for testing card-related methods.
   * @param cardNames - Array of card names to create
   * @returns - Array of mock card objects
   */
  createMockCards(cardNames) {
    return cardNames.map(name => ({
      name,
      id: name.toLowerCase().replace(/\s+/g, '_'),
      toString: () => name // For logging purposes
    }))
  }

  /**
   * Clear all queued responses.
   * @returns - Fluent interface
   */
  clearResponses() {
    this.queuedResponses = []
    return this
  }

  /**
   * Get the number of queued responses remaining.
   * @returns - Number of queued responses
   */
  getQueuedResponseCount() {
    return this.queuedResponses.length
  }

  /**
   * Assert that no responses are left in the queue (all were consumed).
   * Useful in afterEach hooks to ensure tests are properly isolated.
   */
  assertAllResponsesConsumed() {
    if (this.queuedResponses.length > 0) {
      const remainingResponses = this.queuedResponses.map(r => `${r.actor}: ${JSON.stringify(r.selection)}`).join(', ')
      throw new Error(`${this.queuedResponses.length} unused responses remain in queue: [${remainingResponses}]`)
    }
  }

  /**
   * Restore original game methods (useful for cleanup).
   * @returns - Fluent interface
   */
  restore() {
    Object.keys(this.originalMethods).forEach(methodName => {
      this.game[methodName] = this.originalMethods[methodName]
    })
    this.originalMethods = {}
    return this
  }

  /**
   * Get access to the game's action manager.
   * @returns - The action manager instance
   */
  getActionManager() {
    return this.game.actions
  }

  /**
   * Get access to the game's card manager.
   * @returns - The card manager instance
   */
  getCardManager() {
    return this.game.cards
  }

  /**
   * Get access to the game's player manager.
   * @returns - The player manager instance
   */
  getPlayerManager() {
    return this.game.players
  }

  /**
   * Get access to the game's zone manager.
   * @returns - The zone manager instance
   */
  getZoneManager() {
    return this.game.zones
  }

  /**
   * Get access to the game's log manager.
   * @returns - The log manager instance
   */
  getLogManager() {
    return this.game.log
  }

  /**
   * Helper method to inspect the current log entries.
   * Useful for testing logging behavior.
   * @returns - Array of log entries
   */
  getLogEntries() {
    return this.game.log.getLog()
  }

  /**
   * Helper method to get the most recent log entry.
   * @returns - Most recent log entry
   */
  getLastLogEntry() {
    const entries = this.getLogEntries()
    return entries[entries.length - 1]
  }
}

/**
 * Factory function to create a configured test fixture.
 * This is the main entry point for most tests.
 *
 * @param options - Game configuration options
 * @returns - Configured and ready-to-use fixture
 */
function createGameFixture(options = {}) {
  return new GameTestFixture(options).setup().mockInputRequests()
}

/**
 * Factory function for BaseActionManager-specific tests.
 * Provides convenient access to the action manager and common players.
 *
 * @param options - Game configuration options
 * @returns - Object with fixture, actionManager, and player references
 */
function createActionManagerFixture(options = {}) {
  const fixture = createGameFixture(options)

  return {
    fixture,
    actionManager: fixture.getActionManager(),
    player1: fixture.getPlayer1(),
    player2: fixture.getPlayer2(),
    game: fixture.game
  }
}

module.exports = {
  GameTestFixture,
  createGameFixture,
  createActionManagerFixture
}

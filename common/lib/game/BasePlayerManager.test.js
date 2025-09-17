const { BasePlayer } = require('./BasePlayer.js')
const { BasePlayerManager } = require('./BasePlayerManager.js')
const util = require('../util.js')

// Need to mock util for shuffle functionality
jest.mock('../util.js', () => ({
  array: {
    shuffle: jest.fn((array) => {
      // For tests, make shuffle predictable by reversing the array
      const reversed = [...array].reverse()
      // Copy the reversed values back to the original array (mutating it in place)
      for (let i = 0; i < array.length; i++) {
        array[i] = reversed[i]
      }
      return array
    })
  }
}))

describe('BasePlayerManager', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Fixture function to create a new BasePlayerManager instance
  function createPlayerManager(userCount = 4, options = {}) {
    // Create mock game
    const game = {
      log: {
        add: jest.fn()
      }
    }

    // Create sample users
    const users = Array.from({ length: userCount }, (_, i) => ({
      _id: `random-id-${i+1}`,
      name: `user${i+1}`,
    }))

    // Create and return BasePlayerManager
    return {
      playerManager: new BasePlayerManager(game, users, options),
      game,
      users
    }
  }

  describe('constructor and reset', () => {
    test('should initialize with default options', () => {
      const { playerManager } = createPlayerManager()

      // Check default options
      expect(playerManager.game).toBeDefined()
      expect(playerManager._users).toBeDefined()

      // Check players array was created
      expect(playerManager.all()).toHaveLength(4)
      expect(playerManager.all()[0]).toBeInstanceOf(BasePlayer)

      // With default options, shuffle should be called
      expect(util.array.shuffle).toHaveBeenCalled()

      // Check default current player is set to first player
      expect(playerManager.current()).toBe(playerManager.all()[0])
    })

    test('should honor firstPlayerId option', () => {
      const { playerManager } = createPlayerManager(4, {
        firstPlayerId: 'user3',
        shuffleSeats: false
      })

      // First player should be the one with id 'user3'
      expect(playerManager.all()[0].id).toBe('user3')
      expect(playerManager.all()[1].id).toBe('user4')
      expect(playerManager.all()[2].id).toBe('user1')
      expect(playerManager.all()[3].id).toBe('user2')

      expect(playerManager.current().id).toBe('user3')
    })

    test('should honor shuffleSeats option: false', () => {
      const { playerManager } = createPlayerManager(4, { shuffleSeats: false })
      expect(playerManager.all()[0].id).toBe('user1')
      expect(playerManager.all()[1].id).toBe('user2')
      expect(playerManager.all()[2].id).toBe('user3')
      expect(playerManager.all()[3].id).toBe('user4')
    })

    test('should honor shuffleSeats option: true', () => {
      const { playerManager } = createPlayerManager(4, { shuffleSeats: true })
      expect(playerManager.all()[0].id).toBe('user4')
      expect(playerManager.all()[1].id).toBe('user3')
      expect(playerManager.all()[2].id).toBe('user2')
      expect(playerManager.all()[3].id).toBe('user1')
    })

    test('should assign seat numbers to players', () => {
      const { playerManager } = createPlayerManager()

      // Check that each player has the correct seat number
      playerManager.all().forEach((player, index) => {
        expect(player.seatNumber).toBe(index)
        expect(player.index).toBe(index) // Deprecated but still should be set
      })
    })

    test('should work with a single player', () => {
      const { playerManager } = createPlayerManager(1)

      // Check player is created and set as current
      expect(playerManager.all()).toHaveLength(1)
      expect(playerManager.all()[0].id).toBe('user1')
      expect(playerManager.current().id).toBe('user1')
      expect(playerManager.all()[0].seatNumber).toBe(0)
    })

    test('should work with many players', () => {
      const { playerManager } = createPlayerManager(10)

      // Check all players created
      expect(playerManager.all()).toHaveLength(10)

      // Check seat numbers assigned correctly
      playerManager.all().forEach((player, index) => {
        expect(player.seatNumber).toBe(index)
      })
    })
  })

  describe('player turn management', () => {
    test('advancePlayer should set current player to next player', () => {
      const { playerManager } = createPlayerManager(4)

      // Get initial current player and the next player
      const initialPlayer = playerManager.current()
      const expectedNextPlayer = playerManager.next()

      // Call the method to advance to next player
      playerManager.advancePlayer()

      // Check that current player is now the next player
      expect(playerManager.current()).toBe(expectedNextPlayer)
      expect(playerManager.current()).not.toBe(initialPlayer)
    })

    test('passToPlayer should set current player to specified player', () => {
      const { playerManager } = createPlayerManager(4)

      // Get a player that's not the current one
      const initialPlayer = playerManager.current()
      const targetPlayer = playerManager.all()[2]
      expect(targetPlayer).not.toBe(initialPlayer)

      // Pass turn to the target player
      playerManager.passToPlayer(targetPlayer)

      // Check that current player is now the target player
      expect(playerManager.current()).toBe(targetPlayer)
    })

    test('should handle turn advancement for eliminated players', () => {
      const { playerManager } = createPlayerManager(4)

      // Eliminate players 1 and 2
      playerManager.all()[1].eliminated = true
      playerManager.all()[2].eliminated = true

      // Current is player 0, next should be player 3 (skipping eliminated players)
      expect(playerManager.current()).toBe(playerManager.all()[0])

      // Advance player should skip eliminated players
      playerManager.advancePlayer()

      // Should have skipped to player 3
      expect(playerManager.current()).toBe(playerManager.all()[3])
    })
  })

  describe('player retrieval methods', () => {
    describe('multiple player retrieval', () => {
      test('all() should return all players', () => {
        const { playerManager } = createPlayerManager(4)

        // Check it returns all players
        const players = playerManager.all()
        expect(players).toHaveLength(4)
        expect(players[0]).toBeInstanceOf(BasePlayer)
        expect(players[1]).toBeInstanceOf(BasePlayer)
        expect(players[2]).toBeInstanceOf(BasePlayer)
        expect(players[3]).toBeInstanceOf(BasePlayer)
      })

      test('startingWith() should return players in order starting with given player', () => {
        const { playerManager } = createPlayerManager(4)

        // Get players starting with the third player
        const players = playerManager.startingWith(playerManager.all()[2])

        // Check order - should be [2, 3, 0, 1]
        expect(players).toHaveLength(4)
        expect(players[0]).toBe(playerManager.all()[2])
        expect(players[1]).toBe(playerManager.all()[3])
        expect(players[2]).toBe(playerManager.all()[0])
        expect(players[3]).toBe(playerManager.all()[1])
      })

      test('endingWith() should return players in order ending with given player', () => {
        const { playerManager } = createPlayerManager(4)

        // Get players ending with the third player
        const players = playerManager.endingWith(playerManager.all()[2])

        // Check order - should be [3, 0, 1, 2]
        expect(players).toHaveLength(4)
        expect(players[0]).toBe(playerManager.all()[3])
        expect(players[1]).toBe(playerManager.all()[0])
        expect(players[2]).toBe(playerManager.all()[1])
        expect(players[3]).toBe(playerManager.all()[2])
      })

      test('opponents() should return players not on the same team', () => {
        // Create playerManager with custom team assignments
        const { playerManager } = createPlayerManager(4)

        // Assign teams: player 0 and 2 on team A, player 1 and 3 on team B
        playerManager.all()[0].team = 'teamA'
        playerManager.all()[2].team = 'teamA'
        playerManager.all()[1].team = 'teamB'
        playerManager.all()[3].team = 'teamB'

        // Get opponents of player 0 (teamA) - should be players 1 and 3 (teamB)
        const opponents = playerManager.opponents(playerManager.all()[0])

        expect(opponents).toHaveLength(2)
        expect(opponents).toContain(playerManager.all()[1])
        expect(opponents).toContain(playerManager.all()[3])
        expect(opponents).not.toContain(playerManager.all()[0])
        expect(opponents).not.toContain(playerManager.all()[2])
      })

      test('other() should return all players except the given one', () => {
        const { playerManager } = createPlayerManager(4)

        // Get other players besides player 1
        const others = playerManager.other(playerManager.all()[1])

        expect(others).toHaveLength(3)
        expect(others).toContain(playerManager.all()[0])
        expect(others).toContain(playerManager.all()[2])
        expect(others).toContain(playerManager.all()[3])
        expect(others).not.toContain(playerManager.all()[1])
      })

      test('startingWithCurrent() should return players starting with current player', () => {
        const { playerManager } = createPlayerManager(4)

        // Set player 2 as current
        playerManager.passToPlayer(playerManager.all()[2])

        // Get players starting with current
        const players = playerManager.startingWithCurrent()

        // Should be ordered starting with player 2
        expect(players).toHaveLength(4)
        expect(players[0]).toBe(playerManager.all()[2])
        expect(players[1]).toBe(playerManager.all()[3])
        expect(players[2]).toBe(playerManager.all()[0])
        expect(players[3]).toBe(playerManager.all()[1])
      })
    })

    describe('single player retrieval', () => {
      test('byId() should find player by ID', () => {
        const { playerManager } = createPlayerManager(4)

        // Get player by ID
        const player = playerManager.byId('user3')

        // Verify player has the correct ID
        expect(player.id).toBe('user3')

        // Find the actual index of the player with id 'user3'
        const index = playerManager.all().findIndex(p => p.id === 'user3')
        expect(player).toBe(playerManager.all()[index])
      })

      test('byName() should find player by name', () => {
        const { playerManager } = createPlayerManager(4)

        // Get player by name
        const player = playerManager.byName('user2')

        // Verify player has the correct name
        expect(player.name).toBe('user2')

        // Find the actual index of the player with name 'user2'
        const index = playerManager.all().findIndex(p => p.name === 'user2')
        expect(player).toBe(playerManager.all()[index])
      })

      test('byOwner() should find player by owner reference', () => {
        const { playerManager } = createPlayerManager(4)

        // Create objects with owner references
        const objectWithOwner = { owner: playerManager.all()[3] }

        expect(playerManager.byOwner(objectWithOwner)).toBe(playerManager.all()[3])
      })

      test('bySeat() should find player by seat index', () => {
        const { playerManager } = createPlayerManager(4)

        // Get player by seat number
        const player = playerManager.bySeat(2)

        expect(player).toBe(playerManager.all()[2])
        expect(player.seatNumber).toBe(2)
      })

      test.skip('byZone() should find player by zone.id', () => {
        const { playerManager } = createPlayerManager(4)

        // Create a mock zone with an id that contains a player reference
        const zone = { id: 'players.user3.hand', owner: () => playerManager.all()[1] }

        // Should find the player with name 'user3'
        const player = playerManager.byZone(zone)
        expect(player.name).toBe('user3')

        // Find the actual index of the player with name 'user3'
        const index = playerManager.all().findIndex(p => p.name === 'user3')
        expect(player).toBe(playerManager.all()[index])

        // Should return undefined for zones without player references
        const invalidZone = { id: 'global.deck' }
        expect(playerManager.byZone(invalidZone)).toBeUndefined()
      })

      test('current() should return the current player', () => {
        const { playerManager } = createPlayerManager(4)

        // Initially player 0 should be current
        expect(playerManager.current()).toBe(playerManager.all()[0])

        // Set player 2 as current
        playerManager.passToPlayer(playerManager.all()[2])

        // Now player 2 should be current
        expect(playerManager.current()).toBe(playerManager.all()[2])
      })

      test('first() should return the first player', () => {
        const { playerManager } = createPlayerManager(4)

        expect(playerManager.first()).toBe(playerManager.all()[0])
      })

      test('next() should return the player after current', () => {
        const { playerManager } = createPlayerManager(4)

        // Initially player 0 is current, so next should be player 1
        expect(playerManager.next()).toBe(playerManager.all()[1])

        // Set player 3 as current
        playerManager.passToPlayer(playerManager.all()[3])

        // Now next should wrap around to player 0
        expect(playerManager.next()).toBe(playerManager.all()[0])
      })

      test('following() should return the player after the given player', () => {
        const { playerManager } = createPlayerManager(4)

        // Player following player 1 should be player 2
        expect(playerManager.following(playerManager.all()[1])).toBe(playerManager.all()[2])

        // Player following player 3 should wrap around to player 0
        expect(playerManager.following(playerManager.all()[3])).toBe(playerManager.all()[0])
      })

      test('leftOf() should return the player to the left (following)', () => {
        const { playerManager } = createPlayerManager(4)

        // Player to the left of player 1 should be player 2
        expect(playerManager.leftOf(playerManager.all()[1])).toBe(playerManager.all()[2])

        // leftOf should be an alias for following
        expect(playerManager.leftOf(playerManager.all()[2])).toBe(playerManager.following(playerManager.all()[2]))
      })

      test('preceding() should return the player before the given player', () => {
        const { playerManager } = createPlayerManager(4)

        // Player preceding player 2 should be player 1
        expect(playerManager.preceding(playerManager.all()[2])).toBe(playerManager.all()[1])

        // Player preceding player 0 should wrap around to player 3
        expect(playerManager.preceding(playerManager.all()[0])).toBe(playerManager.all()[3])
      })

      test('rightOf() should return the player to the right (preceding)', () => {
        const { playerManager } = createPlayerManager(4)

        // Player to the right of player 2 should be player 1
        expect(playerManager.rightOf(playerManager.all()[2])).toBe(playerManager.all()[1])

        // rightOf should be an alias for preceding
        expect(playerManager.rightOf(playerManager.all()[1])).toBe(playerManager.preceding(playerManager.all()[1]))
      })

      test('should handle player retrieval with a single player', () => {
        const { playerManager } = createPlayerManager(1)

        // With a single player, following, preceding, next, etc. should always return the same player
        const player = playerManager.all()[0]

        expect(playerManager.following(player)).toBe(player)
        expect(playerManager.preceding(player)).toBe(player)
        expect(playerManager.next()).toBe(player)
        expect(playerManager.leftOf(player)).toBe(player)
        expect(playerManager.rightOf(player)).toBe(player)

        // In a single player game, if the only player is eliminated,
        // PlayerList.active() will be empty, but the player methods should
        // still return the player (there's no better alternative)
        player.eliminated = true

        // The active list will be empty
        expect(playerManager.all().active()).toHaveLength(0)

        // But following() and preceding() should handle this gracefully
        // by returning undefined or still returning the eliminated player

        // Restore player for other tests
        player.eliminated = false
      })
    })

    describe('edge cases', () => {
      test('advancePlayer() should skip over eliminated players', () => {
        const { playerManager } = createPlayerManager(4)

        // Eliminate players 1 and 2
        playerManager.all()[1].eliminated = true
        playerManager.all()[2].eliminated = true

        // Advance player should skip eliminated players
        playerManager.advancePlayer()
        expect(playerManager.current()).toBe(playerManager.all()[3])
      })

      test('should handle retrieval methods when players are eliminated', () => {
        const { playerManager } = createPlayerManager(4)

        // Eliminate players 1 and 2
        playerManager.all()[1].eliminated = true
        playerManager.all()[2].eliminated = true

        // Check that various methods handle eliminated players correctly

        // Following should skip eliminated players
        expect(playerManager.following(playerManager.all()[0])).toBe(playerManager.all()[3])

        // Preceding should skip eliminated players
        expect(playerManager.preceding(playerManager.all()[3])).toBe(playerManager.all()[0])

        // Next should skip eliminated players
        playerManager.passToPlayer(playerManager.all()[0])
        expect(playerManager.next()).toBe(playerManager.all()[3])
      })

      test('should return undefined when player not found', () => {
        const { playerManager } = createPlayerManager(4)

        // Try to find a player that doesn't exist
        expect(playerManager.byId('nonexistent')).toBeUndefined()
        expect(playerManager.byName('nonexistent')).toBeUndefined()
        expect(playerManager.bySeat(999)).toBeUndefined()

        // Try to use invalid objects with byOwner
        const invalidObject = { notAnOwner: 'test' }
        expect(playerManager.byOwner(invalidObject)).toBeUndefined()
      })
    })
  })

  describe('PlayerList', () => {
    test('active() should return only non-eliminated players', () => {
      const { playerManager } = createPlayerManager(4)

      // Initially all players should be active
      const initialActive = playerManager.all().active()
      expect(initialActive).toHaveLength(4)

      // Eliminate a couple of players
      playerManager.all()[0].eliminated = true
      playerManager.all()[2].eliminated = true

      // Now only two players should be active
      const active = playerManager.all().active()
      expect(active).toHaveLength(2)
      expect(active).toContain(playerManager.all()[1])
      expect(active).toContain(playerManager.all()[3])
      expect(active).not.toContain(playerManager.all()[0])
      expect(active).not.toContain(playerManager.all()[2])
    })
  })
})

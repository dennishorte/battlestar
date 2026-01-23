const { AgricolaFactory } = require('./agricola.js')
const TestCommon = require('../lib/test_common.js')


const TestUtil = { ...TestCommon }

TestUtil.fixture = function(options) {
  options = Object.assign({
    name: 'test_game',
    seed: 'test_seed',
    numPlayers: 2,
    players: [
      {
        _id: 'dennis_id',
        name: 'dennis',
      },
      {
        _id: 'micah_id',
        name: 'micah',
      },
      {
        _id: 'scott_id',
        name: 'scott',
      },
      {
        _id: 'eliya_id',
        name: 'eliya',
      },
    ],
    playerOptions: {
      shuffleSeats: false,
    },
  }, options)

  options.players = options.players.slice(0, options.numPlayers)

  const game = AgricolaFactory(options, 'dennis')

  game.testSetBreakpoint('initialization-complete', () => {
    // Test setup can go here
  })

  return game
}

TestUtil.gameFixture = function(state) {
  const game = this.fixture(state)

  game.testSetBreakpoint('initialization-complete', (game) => {
    if (state.dennis) {
      this.setPlayerState(game, 'dennis', state.dennis)
    }
    if (state.micah) {
      this.setPlayerState(game, 'micah', state.micah)
    }
  })

  return game
}

TestUtil.setPlayerState = function(game, playerName, state) {
  const player = game.players.byName(playerName)

  // Set resources
  const resources = [
    'food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables',
    'sheep', 'boar', 'cattle',
  ]
  for (const resource of resources) {
    if (state[resource] !== undefined) {
      player[resource] = state[resource]
    }
  }

  // Set farm state
  if (state.familyMembers !== undefined) {
    player.familyMembers = state.familyMembers
    player.availableWorkers = state.familyMembers
  }
  if (state.rooms !== undefined) {
    player.rooms = state.rooms
  }
  if (state.roomType !== undefined) {
    player.roomType = state.roomType
  }
  if (state.fields !== undefined) {
    player.fields = state.fields
  }
  if (state.pastures !== undefined) {
    player.pastures = state.pastures
  }
}

TestUtil.testBoard = function(game, expected) {
  for (const [key, value] of Object.entries(expected)) {
    if (key === 'dennis' || key === 'micah' || key === 'scott' || key === 'eliya') {
      this.testPlayerState(game, key, value)
    }
    else if (key === 'round') {
      expect(game.state.round).toBe(value)
    }
  }
}

TestUtil.testPlayerState = function(game, playerName, expected) {
  const player = game.players.byName(playerName)

  for (const [key, value] of Object.entries(expected)) {
    expect(player[key]).toBe(value)
  }
}


module.exports = TestUtil

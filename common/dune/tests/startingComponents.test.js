const t = require('../testutil')
const constants = require('../res/constants')

describe('Starting Components', () => {

  test('each player starts with 1 water', () => {
    const game = t.fixture()
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(constants.STARTING_WATER)
  })

  test('each player starts with 0 solari and 0 spice', () => {
    const game = t.fixture()
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(constants.STARTING_SOLARI)
    expect(dennis.spice).toBe(constants.STARTING_SPICE)
  })

  test('each player starts with 3 troops in garrison', () => {
    const game = t.fixture()
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(constants.STARTING_TROOPS_IN_GARRISON)
  })

  test('each player starts with 9 troops in supply', () => {
    const game = t.fixture()
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInSupply).toBe(constants.STARTING_TROOPS_IN_SUPPLY)
  })

  test('each player starts with 3 spies in supply', () => {
    const game = t.fixture()
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(constants.STARTING_SPIES)
  })

  test('each player starts with 2 agents', () => {
    const game = t.fixture()
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.availableAgents).toBe(constants.STARTING_AGENTS)
  })

  test('4 maker hooks tokens in bank at start', () => {
    const game = t.fixture()
    game.run()
    // Maker hooks start at 0 per player
    for (const player of game.players.all()) {
      expect(game.state.makerHooks[player.name] || 0).toBe(0)
    }
  })
})

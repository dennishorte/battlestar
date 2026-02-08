const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sequestrator (OccA 144)', () => {
  test('sets up reed and clay on play', () => {
    const card = res.getCardById('sequestrator-a144')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.reedAvailable).toBe(3)
    expect(card.clayAvailable).toBe(4)
  })

  test('gives 3 reed to first player with 3 pastures', () => {
    const card = res.getCardById('sequestrator-a144')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    card.reedAvailable = 3
    card.clayAvailable = 4

    const dennis = t.player(game)
    dennis.getPastureCount = () => 3
    dennis.getFieldCount = () => 2
    dennis.reed = 0

    const micah = game.players.byName('micah')
    micah.getPastureCount = () => 1
    micah.getFieldCount = () => 3

    card.checkTriggers(game)

    expect(dennis.reed).toBe(3)
    expect(card.reedAvailable).toBe(0)
  })

  test('gives 4 clay to first player with 5 fields', () => {
    const card = res.getCardById('sequestrator-a144')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    card.reedAvailable = 3
    card.clayAvailable = 4

    const dennis = t.player(game)
    dennis.getPastureCount = () => 1
    dennis.getFieldCount = () => 5
    dennis.clay = 0
    dennis.reed = 0

    const micah = game.players.byName('micah')
    micah.getPastureCount = () => 2
    micah.getFieldCount = () => 3

    card.checkTriggers(game)

    expect(dennis.clay).toBe(4)
    expect(card.clayAvailable).toBe(0)
  })

  test('does not give reed twice', () => {
    const card = res.getCardById('sequestrator-a144')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    card.reedAvailable = 0
    card.clayAvailable = 4

    const dennis = t.player(game)
    dennis.getPastureCount = () => 3
    dennis.getFieldCount = () => 2
    dennis.reed = 0
    dennis.clay = 0

    card.checkTriggers(game)

    expect(dennis.reed).toBe(0)
  })

  test('does not give clay twice', () => {
    const card = res.getCardById('sequestrator-a144')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    card.reedAvailable = 3
    card.clayAvailable = 0

    const dennis = t.player(game)
    dennis.getPastureCount = () => 2
    dennis.getFieldCount = () => 5
    dennis.reed = 0
    dennis.clay = 0

    card.checkTriggers(game)

    expect(dennis.clay).toBe(0)
  })
})

const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Food Distributor (C155)', () => {
  test('gives 1 grain and sets pending flag on play', () => {
    const card = res.getCardById('food-distributor-c155')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
    expect(dennis.foodDistributorPending).toBe(true)
  })

  test('gives food based on occupied action space cards on return home', () => {
    const card = res.getCardById('food-distributor-c155')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.foodDistributorPending = true
    game.getOccupiedActionSpaceCardCount = () => 4
    game.log = { add: jest.fn() }

    card.onReturnHomeStart(game, dennis)

    expect(dennis.food).toBe(4)
    expect(dennis.foodDistributorPending).toBe(false)
  })

  test('does not give food if pending flag is not set', () => {
    const card = res.getCardById('food-distributor-c155')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.foodDistributorPending = false
    game.getOccupiedActionSpaceCardCount = () => 4

    card.onReturnHomeStart(game, dennis)

    expect(dennis.food).toBe(0)
  })
})

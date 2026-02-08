const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Retail Dealer (OccD 156)', () => {
  test('initializes with 3 grain and 3 food on play', () => {
    const card = res.getCardById('retail-dealer-d156')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.grain).toBe(3)
    expect(card.food).toBe(3)
  })

  test('gives 1 grain and 1 food when using resource-market', () => {
    const card = res.getCardById('retail-dealer-d156')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    card.grain = 3
    card.food = 3

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBe(1)
    expect(card.grain).toBe(2)
    expect(card.food).toBe(2)
  })

  test('only gives grain when food is depleted', () => {
    const card = res.getCardById('retail-dealer-d156')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    card.grain = 2
    card.food = 0

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBe(0)
  })

  test('only gives food when grain is depleted', () => {
    const card = res.getCardById('retail-dealer-d156')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    card.grain = 0
    card.food = 2

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.grain).toBe(0)
    expect(dennis.food).toBe(1)
  })

  test('does nothing when both are depleted', () => {
    const card = res.getCardById('retail-dealer-d156')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    card.grain = 0
    card.food = 0

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.grain).toBe(0)
    expect(dennis.food).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('retail-dealer-d156')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.food = 0
    card.grain = 3
    card.food = 3

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.grain).toBe(0)
    expect(dennis.food).toBe(0)
  })
})

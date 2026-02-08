const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Whale Oil (E051)', () => {
  test('stores food when using fishing action', () => {
    const card = res.getCardById('whale-oil-e051')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    card.stored = 0

    card.onAction(game, dennis, 'fishing')

    expect(card.stored).toBe(1)
  })

  test('accumulates stored food', () => {
    const card = res.getCardById('whale-oil-e051')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    card.stored = 3

    card.onAction(game, dennis, 'fishing')

    expect(card.stored).toBe(4)
  })

  test('does not store food for other actions', () => {
    const card = res.getCardById('whale-oil-e051')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    card.stored = 2

    card.onAction(game, dennis, 'day-laborer')

    expect(card.stored).toBe(2)
  })

  test('gives stored food before playing occupation', () => {
    const card = res.getCardById('whale-oil-e051')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 3

    card.onBeforePlayOccupation(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives no food if nothing stored', () => {
    const card = res.getCardById('whale-oil-e051')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 0

    card.onBeforePlayOccupation(game, dennis)

    expect(dennis.food).toBe(0)
  })
})

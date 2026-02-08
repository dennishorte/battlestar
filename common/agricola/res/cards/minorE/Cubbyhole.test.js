const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cubbyhole (E052)', () => {
  test('stores food when building rooms', () => {
    const card = res.getCardById('cubbyhole-e052')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    card.stored = 0

    card.onBuildRoom(game, dennis, 2)

    expect(card.stored).toBe(2)
  })

  test('accumulates stored food', () => {
    const card = res.getCardById('cubbyhole-e052')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    card.stored = 3

    card.onBuildRoom(game, dennis, 1)

    expect(card.stored).toBe(4)
  })

  test('gives stored food at feeding phase', () => {
    const card = res.getCardById('cubbyhole-e052')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 3

    card.onFeedingPhase(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives no food if nothing stored', () => {
    const card = res.getCardById('cubbyhole-e052')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 0

    card.onFeedingPhase(game, dennis)

    expect(dennis.food).toBe(0)
  })
})

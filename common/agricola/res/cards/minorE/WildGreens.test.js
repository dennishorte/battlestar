const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wild Greens (E050)', () => {
  test('gives food based on unique sow types', () => {
    const card = res.getCardById('wild-greens-e050')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onSow(game, dennis, ['grain', 'vegetables'])

    expect(dennis.food).toBe(2)
  })

  test('gives 1 food for single type', () => {
    const card = res.getCardById('wild-greens-e050')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onSow(game, dennis, ['grain', 'grain', 'grain'])

    expect(dennis.food).toBe(1)
  })

  test('gives 0 food when sowing nothing', () => {
    const card = res.getCardById('wild-greens-e050')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onSow(game, dennis, [])

    expect(dennis.food).toBe(0)
  })

  test('counts duplicate types only once', () => {
    const card = res.getCardById('wild-greens-e050')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onSow(game, dennis, ['grain', 'vegetables', 'grain', 'vegetables'])

    expect(dennis.food).toBe(2)
  })
})

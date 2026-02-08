const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Grain Bag (E067)', () => {
  test('gives bonus grain based on baking improvements on grain-seeds action', () => {
    const card = res.getCardById('grain-bag-e067')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getBakingImprovementCount = () => 3

    card.onAction(game, dennis, 'grain-seeds')

    expect(dennis.grain).toBe(3)
  })

  test('gives no bonus grain if no baking improvements', () => {
    const card = res.getCardById('grain-bag-e067')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getBakingImprovementCount = () => 0

    card.onAction(game, dennis, 'grain-seeds')

    expect(dennis.grain).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('grain-bag-e067')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getBakingImprovementCount = () => 5

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.grain).toBe(0)
  })
})

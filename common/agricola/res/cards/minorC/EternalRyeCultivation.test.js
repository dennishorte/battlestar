const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Eternal Rye Cultivation (C066)', () => {
  test('gives grain with 3+ grain after harvest', () => {
    const card = res.getCardById('eternal-rye-cultivation-c066')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 4

    card.onHarvestEnd(game, dennis)

    expect(dennis.grain).toBe(5)
  })

  test('gives food with exactly 2 grain after harvest', () => {
    const card = res.getCardById('eternal-rye-cultivation-c066')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    dennis.food = 0

    card.onHarvestEnd(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.grain).toBe(2)
  })
})

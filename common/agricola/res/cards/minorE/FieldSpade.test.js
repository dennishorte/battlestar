const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Spade (E079)', () => {
  test('gives 1 stone when sowing in at least 1 field', () => {
    const card = res.getCardById('field-spade-e079')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onSow(game, dennis, ['grain'])

    expect(dennis.stone).toBe(1)
  })

  test('gives 1 stone for sowing multiple types', () => {
    const card = res.getCardById('field-spade-e079')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onSow(game, dennis, ['grain', 'vegetables', 'grain'])

    expect(dennis.stone).toBe(1)
  })

  test('does not give stone when sowing nothing', () => {
    const card = res.getCardById('field-spade-e079')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onSow(game, dennis, [])

    expect(dennis.stone).toBe(0)
  })

  test('does not give stone when types is null', () => {
    const card = res.getCardById('field-spade-e079')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onSow(game, dennis, null)

    expect(dennis.stone).toBe(0)
  })
})

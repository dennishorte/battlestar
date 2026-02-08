const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Uncaring Parents (E099)', () => {
  test('gives bonus point at harvest end when in stone house', () => {
    const card = res.getCardById('uncaring-parents-e099')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.bonusPoints = 0

    card.onHarvestEnd(game, dennis)

    expect(dennis.bonusPoints).toBe(1)
  })

  test('does not give bonus point when not in stone house', () => {
    const card = res.getCardById('uncaring-parents-e099')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.bonusPoints = 0

    card.onHarvestEnd(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('accumulates bonus points across multiple harvests', () => {
    const card = res.getCardById('uncaring-parents-e099')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.bonusPoints = 2

    card.onHarvestEnd(game, dennis)

    expect(dennis.bonusPoints).toBe(3)
  })
})

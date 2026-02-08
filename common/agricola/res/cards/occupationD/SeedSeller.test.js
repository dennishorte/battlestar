const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seed Seller (OccD 141)', () => {
  test('gives 1 grain on play', () => {
    const card = res.getCardById('seed-seller-d141')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('gives 1 additional grain when using take-grain', () => {
    const card = res.getCardById('seed-seller-d141')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain for other actions', () => {
    const card = res.getCardById('seed-seller-d141')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.grain).toBe(0)
  })
})

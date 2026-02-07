const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seed Pellets (A065)', () => {
  test('gives 1 grain on unconditional sow', () => {
    const card = res.getCardById('seed-pellets-a065')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onSow(game, dennis, true)

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain on conditional sow', () => {
    const card = res.getCardById('seed-pellets-a065')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onSow(game, dennis, false)

    expect(dennis.grain).toBe(0)
  })
})

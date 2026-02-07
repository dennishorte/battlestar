const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Firewood (C075)', () => {
  test('accumulates wood on returning home', () => {
    const card = res.getCardById('firewood-c075')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.firewoodWood = 2

    card.onReturnHome(game, dennis)

    expect(dennis.firewoodWood).toBe(3)
  })
})

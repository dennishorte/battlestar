const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Drift-Net Boat (A051)', () => {
  test('gives +2 food on Fishing action', () => {
    const card = res.getCardById('drift-net-boat-a051')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(2)
  })
})

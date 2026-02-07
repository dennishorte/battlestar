const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Brewery Pond (B040)', () => {
  test('gives 1 grain and 1 wood on Fishing action', () => {
    const card = res.getCardById('brewery-pond-b040')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.wood = 0

    card.onAction(game, dennis, 'fishing')

    expect(dennis.grain).toBe(1)
    expect(dennis.wood).toBe(1)
  })

  test('gives 1 grain and 1 wood on Reed Bank action', () => {
    const card = res.getCardById('brewery-pond-b040')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.wood = 0

    card.onAction(game, dennis, 'take-reed')

    expect(dennis.grain).toBe(1)
    expect(dennis.wood).toBe(1)
  })
})

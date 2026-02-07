const t = require('../../../testutil.js')

describe('Market Stall (B008)', () => {
  test('exchanges 1 grain for 1 vegetable', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        grain: 1,
        vegetables: 0,
        hand: ['market-stall-b008'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'market-stall-b008')

    const dennis = t.player(game)
    expect(dennis.grain).toBe(0) // Cost
    expect(dennis.vegetables).toBe(1)
  })
})

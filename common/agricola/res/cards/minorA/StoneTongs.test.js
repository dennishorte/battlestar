const t = require('../../../testutil.js')

describe('Stone Tongs (A080)', () => {
  test('gives +1 stone on quarry action', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['stone-tongs-a080'],
      },
      round: 6, // Need stage 2+ for stone actions
    })
    game.run()

    t.choose(game, 'Western Quarry')

    const dennis = t.player(game)
    expect(dennis.stone).toBe(2) // 1 accumulated + 1 from Stone Tongs
  })
})

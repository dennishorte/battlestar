const t = require('../../../testutil.js')

describe('Corn Scoop (A067)', () => {
  test('gives +1 grain on Grain Seeds action', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['corn-scoop-a067'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    const dennis = t.player(game)
    expect(dennis.grain).toBe(2) // 1 base + 1 from Corn Scoop
  })
})

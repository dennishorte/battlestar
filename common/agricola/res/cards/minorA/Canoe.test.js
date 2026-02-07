const t = require('../../../testutil.js')

describe('Canoe (A078)', () => {
  test('gives +1 food and +1 reed on Fishing action', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['canoe-a078'],
      },
    })
    game.run()

    t.choose(game, 'Fishing (1)')

    const dennis = t.player(game)
    expect(dennis.food).toBe(2) // 1 accumulated + 1 from Canoe
    expect(dennis.reed).toBe(1) // +1 from Canoe
  })
})

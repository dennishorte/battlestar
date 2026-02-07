const t = require('../../../testutil.js')

describe('Moldboard Plow (B019)', () => {
  test('places 2 field charges on card', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 2,
        hand: ['moldboard-plow-b019'],
        occupations: ['wood-cutter'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'moldboard-plow-b019')

    const dennis = t.player(game)
    expect(dennis.moldboardPlowCharges).toBe(2)
  })
})

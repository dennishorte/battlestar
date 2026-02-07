const t = require('../../../testutil.js')

describe('Swing Plow (C019)', () => {
  test('places 4 field tiles on card', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        wood: 3,
        hand: ['swing-plow-c019'],
        occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'swing-plow-c019')

    const dennis = t.player(game)
    expect(dennis.swingPlowCharges).toBe(4)
  })
})

const t = require('../../../testutil.js')

describe('Clay Embankment (A005)', () => {
  test('gives bonus clay on play', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        food: 1, // cost
        clay: 5,
        hand: ['clay-embankment-a005'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'clay-embankment-a005')

    const dennis = t.player(game)
    // 5 + floor(5/2) = 7
    expect(dennis.clay).toBe(7)
  })

  test('gives nothing with 0-1 clay', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        food: 1, // cost
        clay: 1,
        hand: ['clay-embankment-a005'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'clay-embankment-a005')

    const dennis = t.player(game)
    // floor(1/2) = 0, so still 1
    expect(dennis.clay).toBe(1)
  })
})

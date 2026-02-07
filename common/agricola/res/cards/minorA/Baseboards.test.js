const t = require('../../../testutil.js')

describe('Baseboards (A004)', () => {
  test('gives wood for rooms and bonus if rooms > people', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        food: 2,
        grain: 1,
        wood: 0,
        hand: ['baseboards-a004'],
        farmyard: { rooms: 3 },
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'baseboards-a004')

    const dennis = t.player(game)
    // 3 rooms, 2 people -> 3 + 1 = 4 wood
    expect(dennis.wood).toBe(4)
  })
})

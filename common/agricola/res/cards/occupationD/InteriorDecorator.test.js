const t = require('../../../testutil_v2.js')

describe('Interior Decorator', () => {
  test('onRenovate schedules 1 food per round for next 6 rounds', () => {
    // House Redevelopment is stage 2. actionSpaces auto-fills 4 stage 1 cards + 1 stage 2 = 5 total.
    // So the game plays round 5. Wood->clay renovation costs 1 clay per room + 1 reed (2 rooms = 2 clay + 1 reed).
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['interior-decorator-d111'],
        clay: 2,
        reed: 1,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['interior-decorator-d111'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        food: 10,
        scheduled: {
          food: { 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1 },
        },
      },
    })
  })
})

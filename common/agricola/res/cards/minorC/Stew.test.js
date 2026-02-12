const t = require('../../../testutil_v2.js')

describe('Stew', () => {
  test('schedules 1 food on next 4 rounds when using Day Laborer', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stew-c045'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // Day Laborer gives 2 food
        minorImprovements: ['stew-c045'],
        scheduled: {
          food: { 4: 1, 5: 1, 6: 1, 7: 1 },
        },
      },
    })
  })
})

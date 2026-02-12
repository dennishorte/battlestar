const t = require('../../../testutil_v2.js')

describe('Chicken Coop', () => {
  test('schedules 1 food on next 8 rounds', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['chicken-coop-c044'],
        wood: 2,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Chicken Coop')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['chicken-coop-c044'],
        scheduled: {
          food: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1 },
        },
      },
    })
  })
})

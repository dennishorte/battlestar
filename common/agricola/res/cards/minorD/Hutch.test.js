const t = require('../../../testutil_v2.js')

describe('Hutch', () => {
  test('schedules 0, 1, 2, 3 food on next 4 rounds', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['hutch-d043'],
        wood: 1,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Hutch')

    // Round 6: 0 (skipped), 7: 1, 8: 2, 9: 3
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['hutch-d043'],
        scheduled: {
          food: { 7: 1, 8: 2, 9: 3 },
        },
      },
    })
  })
})

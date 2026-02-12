const t = require('../../../testutil_v2.js')

describe('Private Forest', () => {
  test('schedules 1 wood on remaining even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['private-forest-c074'],
        occupations: ['test-occupation-1'],
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Private Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // 2 start + 1 MP - 2 cost
        occupations: ['test-occupation-1'],
        minorImprovements: ['private-forest-c074'],
        scheduled: {
          wood: { 6: 1, 8: 1, 10: 1, 12: 1, 14: 1 },
        },
      },
    })
  })
})

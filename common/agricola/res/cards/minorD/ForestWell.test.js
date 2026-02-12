const t = require('../../../testutil_v2.js')

describe('Forest Well', () => {
  test('schedules food up to wood in supply', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['forest-well-d044'],
        stone: 1,
        food: 1,
        wood: 4,
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Forest Well')

    // 4 wood → 4 food scheduled on rounds 9, 10, 11, 12
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // 1 start + 1 MP - 1 cost
        wood: 4,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['forest-well-d044'],
        scheduled: {
          food: { 9: 1, 10: 1, 11: 1, 12: 1 },
        },
      },
    })
  })
})

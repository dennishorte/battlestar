const t = require('../../../testutil_v2.js')

describe('Small Greenhouse', () => {
  test('schedules vegetable purchase on rounds current+4 and current+7', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['small-greenhouse-d069'],
        wood: 2,
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Small Greenhouse')

    // Round 3 + 4 = 7, round 3 + 7 = 10
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        occupations: ['test-occupation-1'],
        minorImprovements: ['small-greenhouse-d069'],
        scheduled: {
          vegetablesPurchase: { 7: 1, 10: 1 },
        },
      },
    })
  })
})

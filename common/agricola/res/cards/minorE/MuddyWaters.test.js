const t = require('../../../testutil_v2.js')

describe('Muddy Waters', () => {
  test('alternates food and clay on remaining even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['muddy-waters-e041'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Muddy Waters')

    // Even rounds after 5: 6, 8, 10, 12, 14
    // Alternating food/clay: food(6), clay(8), food(10), clay(12), food(14)
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['muddy-waters-e041'],
        scheduled: {
          food: { 6: 1, 10: 1, 14: 1 },
          clay: { 8: 1, 12: 1 },
        },
      },
    })
  })
})

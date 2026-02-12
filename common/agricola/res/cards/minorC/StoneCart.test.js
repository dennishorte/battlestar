const t = require('../../../testutil_v2.js')

describe('Stone Cart', () => {
  test('schedules 1 stone on remaining even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stone-cart-c079'],
        wood: 2,
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Stone Cart')

    // Even rounds after 5: 6, 8, 10, 12, 14
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['stone-cart-c079'],
        scheduled: {
          stone: { 6: 1, 8: 1, 10: 1, 12: 1, 14: 1 },
        },
      },
    })
  })
})

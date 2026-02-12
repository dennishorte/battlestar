const t = require('../../../testutil_v2.js')

describe('Wholesale Market', () => {
  test('schedules 1 food on each remaining round', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wholesale-market-d057'],
        wood: 2,
        vegetables: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wholesale Market')

    // Rounds 11-14: 1 food each
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['wholesale-market-d057'],
        scheduled: {
          food: { 11: 1, 12: 1, 13: 1, 14: 1 },
        },
      },
    })
  })
})

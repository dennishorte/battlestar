const t = require('../../../testutil_v2.js')

describe('Farmers Market', () => {
  test('gives 1 vegetable on play (costs 2 food)', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['farmers-market-e008'],
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Farmers Market')

    // Started with 2 food, Meeting Place gives 1 = 3, card costs 2 = 1 left
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        vegetables: 1,
        minorImprovements: ['farmers-market-e008'],
      },
    })
  })
})

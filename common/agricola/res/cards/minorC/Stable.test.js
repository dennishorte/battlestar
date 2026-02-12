const t = require('../../../testutil_v2.js')

describe('Stable', () => {
  test('builds 1 free stable on play', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-c002'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Stable')
    // Choose location for stable
    t.choose(game, '2,0')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        food: 1, // Meeting Place gives 1 food
        minorImprovements: ['stable-c002'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})

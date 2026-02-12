const t = require('../../../testutil_v2.js')

describe('Foreign Aid', () => {
  test('gives 6 food on play', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['foreign-aid-d050'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Foreign Aid')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 7, // 6 from Foreign Aid + 1 from Meeting Place
        minorImprovements: ['foreign-aid-d050'],
      },
    })
  })
})

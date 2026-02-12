const t = require('../../../testutil_v2.js')

describe('Pumpernickel', () => {
  test('gives 4 food on play (costs 1 grain)', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pumpernickel-e007'],
        grain: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Pumpernickel')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        food: 5, // 4 from Pumpernickel + 1 from Meeting Place
        minorImprovements: ['pumpernickel-e007'],
      },
    })
  })
})

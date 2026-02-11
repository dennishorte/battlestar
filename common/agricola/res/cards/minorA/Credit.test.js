const t = require('../../../testutil_v2.js')

describe('Credit', () => {
  test('gives 5 food on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['credit-a054'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Credit')

    t.testBoard(game, {
      dennis: {
        food: 6, // +1 from Meeting Place + 5 from Credit
        hand: [],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['credit-a054'],
      },
    })
  })
})

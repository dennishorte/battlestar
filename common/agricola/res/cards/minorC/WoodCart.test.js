const t = require('../../../testutil_v2.js')

describe('Wood Cart', () => {
  test('gives 2 additional wood on wood action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-cart-c076'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    t.choose(game, 'Forest')       // dennis: 3 wood + 2 Wood Cart = 5
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        wood: 5,
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['wood-cart-c076'],
      },
    })
  })
})

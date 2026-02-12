const t = require('../../../testutil_v2.js')

describe('Grain Bag', () => {
  test('get 1 bonus grain per baking improvement when using Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['grain-bag-e067'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    // Dennis uses Grain Seeds → Grain Bag triggers (1 baking improvement)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 2,  // 1 (Grain Seeds) + 1 (Grain Bag: 1 baking improvement)
        minorImprovements: ['grain-bag-e067'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

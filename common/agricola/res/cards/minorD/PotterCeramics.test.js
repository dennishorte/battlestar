const t = require('../../../testutil_v2.js')

describe('Potter Ceramics', () => {
  test('exchange 1 clay for 1 grain before baking', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['sow-bake'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['potter-ceramics-d066'],
        majorImprovements: ['fireplace-2'],
        clay: 1,
        grain: 1,
      },
    })
    game.run()

    // Dennis uses Grain Utilization → no fields, skip sow → Potter Ceramics before bake
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Exchange 1 clay for 1 grain')  // Potter Ceramics
    t.choose(game, 'Bake 2 grain')  // Bake both grains (original + pottery)

    t.testBoard(game, {
      dennis: {
        clay: 0,    // 1 - 1 = 0
        grain: 0,   // 1 + 1 (Pottery) - 2 (baked) = 0
        food: 4,    // 2 grain * 2 food (fireplace-2) = 4
        minorImprovements: ['potter-ceramics-d066'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

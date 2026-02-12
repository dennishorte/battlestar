const t = require('../../../testutil_v2.js')

describe('Beer Stein', () => {
  test('turn 1 grain into 2 food and 1 bonus point on bake', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['sow-bake'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beer-stein-c061'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
    })
    game.run()

    // Dennis uses Grain Utilization → no fields, bake → Beer Stein triggers after
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 2 grain')  // Bake 2 grain (2 * 2 food = 4)
    t.choose(game, 'Turn 1 grain into 2 food and 1 bonus point')  // Beer Stein

    t.testBoard(game, {
      dennis: {
        grain: 0,   // 3 - 2 (baked) - 1 (Beer Stein) = 0
        food: 6,    // 4 (baked) + 2 (Beer Stein) = 6
        bonusPoints: 1,
        minorImprovements: ['beer-stein-c061'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

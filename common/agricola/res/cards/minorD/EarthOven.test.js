const t = require('../../../testutil_v2.js')

describe('Earth Oven', () => {
  test('bakes bread at rate 2 via bakingConversion', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['earth-oven-d059'],
        grain: 2,
        food: 0,
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    // No fields to sow, skip straight to baking
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 2 - 1 baked
        food: 2, // 1 grain * 2 food
        minorImprovements: ['earth-oven-d059'],
      },
    })
  })
})

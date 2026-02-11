const t = require('../../../testutil_v2.js')

describe('Dutch Windmill', () => {
  test('gives 3 extra food when baking in the round after a harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // 4 action spaces → round 4 → game plays round 5 (right after harvest round 4)
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dutch-windmill-a063'],
        majorImprovements: ['fireplace-2'],
        grain: 1,
      },
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement'],
    })
    game.run()

    // Dennis takes Grain Utilization (no fields so skip sow, goes to bake)
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 0,
        food: 5, // 2 from fireplace + 3 from Dutch Windmill
        minorImprovements: ['dutch-windmill-a063'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('does not give extra food when baking in a non-post-harvest round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dutch-windmill-a063'],
        majorImprovements: ['fireplace-2'],
        grain: 1,
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 0,
        food: 2, // only 2 from fireplace, no Dutch Windmill bonus
        minorImprovements: ['dutch-windmill-a063'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

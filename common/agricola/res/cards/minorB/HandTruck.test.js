const t = require('../../../testutil_v2.js')

describe('Hand Truck', () => {
  test('gives grain equal to people on accumulation spaces when baking', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hand-truck-b067'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
      },
    })
    game.run()

    // Dennis takes Forest (accumulation space)
    t.choose(game, 'Forest')
    // Micah does anything
    t.choose(game, 'Day Laborer')
    // Dennis uses Grain Utilization to bake — has 1 person on accumulation space
    t.choose(game, 'Grain Utilization')
    // Hand Truck gives 1 grain before baking, then bake 1 grain
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        wood: 3, // from Forest
        grain: 2, // 2 original + 1 from Hand Truck - 1 baked = 2
        food: 2, // 2 from baking 1 grain with fireplace
        minorImprovements: ['hand-truck-b067'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('no extra grain with no people on accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['hand-truck-b067'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
      },
    })
    game.run()

    // Dennis goes straight to Grain Utilization — no one on accumulation spaces
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 2 - 1 baked
        food: 2, // from baking 1 grain with fireplace
        minorImprovements: ['hand-truck-b067'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

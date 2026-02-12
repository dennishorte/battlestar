const t = require('../../../testutil_v2.js')

describe("Small Potter's Oven", () => {
  test('buy Clay Oven before baking', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        grain: 1,
        clay: 3,
        stone: 1,
        minorImprovements: ['small-potters-oven-c060'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    // No fields → skip sow → bakeBread
    // onBeforeBake → Small Potter's Oven: buy Clay Oven
    t.choose(game, 'Clay Oven (clay-oven)')
    // Clay Oven onBuy → bakeBread (recursive): bake with Clay Oven
    t.choose(game, 'Bake 1 grain')   // 1 grain → 5 food

    t.testBoard(game, {
      dennis: {
        food: 5,
        // clay: 0  (3 - 3 for Clay Oven)
        // stone: 0 (1 - 1 for Clay Oven)
        // grain: 0 (1 - 1 baked)
        minorImprovements: ['small-potters-oven-c060'],
        majorImprovements: ['fireplace-2', 'clay-oven'],
      },
    })
  })

  test('decline oven purchase and bake with existing improvement', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        grain: 1,
        clay: 3,
        stone: 1,
        minorImprovements: ['small-potters-oven-c060'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    // onBeforeBake → Small Potter's Oven: decline
    t.choose(game, 'Do not buy')
    // Bake with Fireplace: 1 grain → 2 food
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 2,    // 1 grain × 2 food (Fireplace)
        clay: 3,
        stone: 1,
        // grain: 0
        minorImprovements: ['small-potters-oven-c060'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

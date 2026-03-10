const t = require('../../../testutil_v2.js')

describe('Stone Oven', () => {
  test('purchase triggers bake bread action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 1,
        stone: 3,
        grain: 2,
        food: 0,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Stone Oven (stone-oven)')
    // Stone Oven allows baking up to 2 grain at 4 food each
    t.choose(game, 'Bake 2 grain')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        stone: 0,
        grain: 0, // Started with 2, baked 2
        food: 8, // 2 grain * 4 food
        majorImprovements: ['stone-oven'],
      },
    })
  })

  test('free bake on build allows using other baking improvements', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 1,
        stone: 3,
        grain: 4,
        food: 0,
        majorImprovements: ['fireplace-2'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Stone Oven (stone-oven)')
    // Has Stone Oven (4 food/grain, limit 2) and Fireplace (2 food/grain)
    t.choose(game, 'Stone Oven')
    t.choose(game, 'Bake 2 grain')
    // After Stone Oven, offered Fireplace
    t.choose(game, 'Fireplace')
    t.choose(game, 'Bake 2 grain')

    t.testBoard(game, {
      dennis: {
        grain: 0, // Started with 4, baked all
        food: 12, // 8 (Stone Oven: 2*4) + 4 (Fireplace: 2*2)
        majorImprovements: ['stone-oven', 'fireplace-2'],
      },
    })
  })
})

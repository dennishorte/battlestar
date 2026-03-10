const t = require('../../../testutil_v2.js')

describe('Clay Oven', () => {
  test('purchase triggers bake bread action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 3,
        stone: 1,
        grain: 2,
        food: 0,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        stone: 0,
        grain: 1, // Started with 2, baked 1
        food: 5, // 1 grain * 5 food
        majorImprovements: ['clay-oven'],
      },
    })
  })

  test('can decline bake bread on build', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 3,
        stone: 1,
        grain: 1,
        food: 0,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
    t.choose(game, 'Do not bake')

    t.testBoard(game, {
      dennis: {
        grain: 1, // Unchanged
        food: 0, // Unchanged
        majorImprovements: ['clay-oven'],
      },
    })
  })

  test('free bake on build allows using other baking improvements', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 3,
        stone: 1,
        grain: 3,
        food: 0,
        majorImprovements: ['fireplace-2'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
    // Now has Clay Oven (5 food/grain, limit 1) and Fireplace (2 food/grain)
    // Should be offered a choice of which improvement to use
    t.choose(game, 'Clay Oven')
    t.choose(game, 'Bake 1 grain')
    // After using Clay Oven, should be offered Fireplace
    t.choose(game, 'Fireplace')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        stone: 0,
        grain: 1, // Started with 3, baked 2
        food: 7, // 5 (Clay Oven) + 2 (Fireplace)
        majorImprovements: ['clay-oven', 'fireplace-2'],
      },
    })
  })

  test('free bake with multiple improvements allows done baking early', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 3,
        stone: 1,
        grain: 3,
        food: 0,
        majorImprovements: ['fireplace-2'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
    // Use Clay Oven only, then stop
    t.choose(game, 'Clay Oven')
    t.choose(game, 'Bake 1 grain')
    t.choose(game, 'Done baking')

    t.testBoard(game, {
      dennis: {
        grain: 2,
        food: 5, // 5 from Clay Oven only
        majorImprovements: ['clay-oven', 'fireplace-2'],
      },
    })
  })
})

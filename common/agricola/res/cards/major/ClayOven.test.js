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
})

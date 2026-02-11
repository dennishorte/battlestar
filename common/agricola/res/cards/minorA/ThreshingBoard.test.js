const t = require('../../../testutil_v2.js')

describe('Threshing Board', () => {
  test('triggers bake bread when using Farmland action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['threshing-board-a024'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        grain: 3,
        majorImprovements: ['fireplace-2'], // can bake: 1 grain → 2 food
      },
    })
    game.run()

    // Dennis takes Farmland, plows a field. ThreshingBoard triggers bake bread.
    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // plow field
    // Bake bread triggered by ThreshingBoard
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 2, // 3 - 1 baked
        food: 2, // from baking 1 grain with Fireplace (1 grain → 2 food)
        minorImprovements: ['threshing-board-a024'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})

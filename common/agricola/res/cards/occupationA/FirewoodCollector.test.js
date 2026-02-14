const t = require('../../../testutil_v2.js')

describe('Firewood Collector', () => {
  test('onAction grants 1 wood after Farmland action', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farmland'],
      dennis: {
        occupations: ['firewood-collector-a119'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // Plow a field

    t.testBoard(game, {
      dennis: {
        occupations: ['firewood-collector-a119'],
        wood: 1, // 1 wood from Firewood Collector
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('onAction grants 1 wood after Grain Seeds action', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Seeds'],
      dennis: {
        occupations: ['firewood-collector-a119'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        occupations: ['firewood-collector-a119'],
        wood: 1, // 1 wood from Firewood Collector
        grain: 1,
      },
    })
  })

  test('onAction grants 1 wood after Grain Utilization action', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['firewood-collector-a119'],
        wood: 0,
        grain: 1,
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['firewood-collector-a119'],
        wood: 1, // 1 wood from Firewood Collector
        grain: 0,
        food: 2, // from baking
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Mill Wheel', () => {
  test('gives 2 extra food when using sow-bake while fishing is occupied', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mill-wheel-b064'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Dennis uses Fishing (occupies fishing space)
    t.choose(game, 'Fishing')
    // Micah does anything
    t.choose(game, 'Day Laborer')
    // Dennis uses Grain Utilization — Mill Wheel triggers since fishing is occupied
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    // Bake bread
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 5, // 1 from Fishing + 2 from Mill Wheel + 2 from baking 1 grain with fireplace
        minorImprovements: ['mill-wheel-b064'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('no extra food when fishing is NOT occupied', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mill-wheel-b064'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Dennis uses Grain Utilization without anyone on fishing
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 2, // only 2 from baking 1 grain with fireplace, no Mill Wheel bonus
        minorImprovements: ['mill-wheel-b064'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})

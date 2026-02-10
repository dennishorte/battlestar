const t = require('../../../testutil_v2.js')

describe('Garden Hoe', () => {
  test('gives 1 clay and 1 stone when sowing vegetables', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['garden-hoe-a079'],
        vegetables: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // dennis: Grain Utilization → sow vegetables
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'vegetables' })
    // Only 1 field → sow loop auto-exits, no "Done Sowing" needed
    // onSowVegetables fires: +1 clay, +1 stone

    // Remaining workers
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        clay: 1,   // Garden Hoe
        stone: 1,  // Garden Hoe
        food: 2,   // Day Laborer
        minorImprovements: ['garden-hoe-a079'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 2 }],
        },
      },
    })
  })

  test('does not trigger when sowing only grain', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['garden-hoe-a079'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // dennis: sow grain only (no vegetables)
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['garden-hoe-a079'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})

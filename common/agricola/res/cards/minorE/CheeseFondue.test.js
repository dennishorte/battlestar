const t = require('../../../testutil_v2.js')

describe('Cheese Fondue', () => {
  test('gives 2 bonus food when baking with sheep and cattle', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['cheese-fondue-e057'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 1, col: 2 }], cattle: 1 },
          ],
        },
      },
    })
    game.run()

    // dennis: Grain Utilization → no fields, skip sow → bake 1 grain
    // Fireplace: 1 grain → 2 food
    // Cheese Fondue: has sheep (+1) and cattle (+1) → +2 bonus food
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    // Remaining turns
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Fishing')      // micah

    t.testBoard(game, {
      dennis: {
        grain: 1,    // 2 - 1 baked
        food: 6,     // 2 (bake) + 2 (Cheese Fondue) + 2 (Day Laborer)
        minorImprovements: ['cheese-fondue-e057'],
        majorImprovements: ['fireplace-2'],
        animals: { sheep: 2, cattle: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 1, col: 2 }], cattle: 1 },
          ],
        },
      },
    })
  })

  test('gives 1 bonus food with only sheep', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['cheese-fondue-e057'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Fishing')      // micah

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 5,     // 2 (bake) + 1 (Cheese Fondue: sheep only) + 2 (Day Laborer)
        minorImprovements: ['cheese-fondue-e057'],
        majorImprovements: ['fireplace-2'],
        animals: { sheep: 2 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
          ],
        },
      },
    })
  })
})

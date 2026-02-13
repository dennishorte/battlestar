const t = require('../../../testutil_v2.js')

describe('Wild Greens', () => {
  test('gives 1 food per unique crop type sowed', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['wild-greens-e050'],
        grain: 2,
        vegetables: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
    game.run()

    // dennis: Grain Utilization → sow grain + vegetables → Wild Greens fires
    // 2 unique types (grain, vegetables) → +2 food
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.action(game, 'sow-field', { row: 0, col: 3, cropType: 'vegetables' })
    t.choose(game, 'Done Sowing')

    // Remaining turns
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    t.testBoard(game, {
      dennis: {
        grain: 1,        // 2 - 1 sowed
        // vegetables: 0  (1 - 1 sowed)
        food: 4,         // 0 + 2 (Wild Greens: 2 unique types) + 2 (Day Laborer)
        minorImprovements: ['wild-greens-e050'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
  })

  test('gives 1 food when sowing only one crop type', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['wild-greens-e050'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
    game.run()

    // Sow 2 grain → only 1 unique type → +1 food
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.action(game, 'sow-field', { row: 0, col: 3, cropType: 'grain' })

    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    t.testBoard(game, {
      dennis: {
        // grain: 0  (2 - 2 sowed)
        food: 3,     // 0 + 1 (Wild Greens: 1 unique type) + 2 (Day Laborer)
        minorImprovements: ['wild-greens-e050'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })
})

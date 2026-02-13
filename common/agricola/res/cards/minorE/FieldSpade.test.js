const t = require('../../../testutil_v2.js')

describe('Field Spade', () => {
  test('gives 1 stone after sowing at least 1 field', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['field-spade-e079'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
    game.run()

    // dennis: Grain Utilization → sow grain → Field Spade fires → +1 stone
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.choose(game, 'Done Sowing')

    // Remaining turns
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    t.testBoard(game, {
      dennis: {
        grain: 1,    // 2 - 1 sowed
        stone: 1,    // from Field Spade
        food: 2,     // 0 + 2 (Day Laborer)
        minorImprovements: ['field-spade-e079'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3 },
          ],
        },
      },
    })
  })
})

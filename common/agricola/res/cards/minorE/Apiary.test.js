const t = require('../../../testutil_v2.js')

describe('Apiary', () => {
  test('sow 1 field at end of work phase', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        minorImprovements: ['apiary-e023'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain → 2
    t.choose(game, 'Clay Pit')      // micah

    // Work phase ends → Apiary triggers
    t.choose(game, 'Sow 1 field')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        grain: 1,   // 1 + 1 (GS) - 1 (sowed) = 1
        food: 2,    // Day Laborer
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        minorImprovements: ['apiary-e023'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})

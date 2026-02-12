const t = require('../../../testutil_v2.js')

describe('Drill Harrow', () => {
  test('pay 3 food to plow before sowing', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['sow-bake'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['drill-harrow-d017'],
        food: 3,
        grain: 1,
      },
    })
    game.run()

    // Dennis uses Grain Utilization → Drill Harrow triggers before sow
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Pay 3 food to plow 1 field')
    t.choose(game, '2,0')  // choose plow location
    // Now sow on the newly plowed field (auto-exits sow loop after: 0 grain left)
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        food: 0,    // 3 - 3 = 0
        grain: 0,   // 1 - 1 (sowed) = 0
        minorImprovements: ['drill-harrow-d017'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})

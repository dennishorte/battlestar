const t = require('../../../testutil_v2.js')

describe('Seaweed Fertilizer', () => {
  test('get 1 grain after sowing (before round 11)', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['sow-bake'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['seaweed-fertilizer-c073'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
    game.run()

    // Dennis uses Grain Utilization → sow → Seaweed Fertilizer gives 1 grain after
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.choose(game, 'Done Sowing')

    // grain: 2 - 1 (sowed) + 1 (Seaweed Fertilizer) = 2
    t.testBoard(game, {
      dennis: {
        grain: 2,
        minorImprovements: ['seaweed-fertilizer-c073'],
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

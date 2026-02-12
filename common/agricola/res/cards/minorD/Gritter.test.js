const t = require('../../../testutil_v2.js')

describe('Gritter', () => {
  test('gives 1 food per vegetable field when sowing vegetables', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['gritter-d058'],
        vegetables: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
    game.run()

    // Sow 1 vegetable on field → 1 veg field → Gritter gives 1 food
    // (sow loop auto-exits since player has no more crops after sowing 1 veg)
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'vegetables' })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        minorImprovements: ['gritter-d058'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3 },
          ],
        },
      },
    })
  })
})

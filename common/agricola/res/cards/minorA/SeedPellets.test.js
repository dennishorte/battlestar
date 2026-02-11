const t = require('../../../testutil_v2.js')

describe('Seed Pellets', () => {
  test('gives 1 grain before sowing via Grain Utilization', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['seed-pellets-a065'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // dennis: Grain Utilization (sow + bake)
    // onSow fires first: +1 grain (now 2)
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.choose(game, 'Done Sowing')
    // No baking ability → skipped

    // Remaining workers
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        grain: 1,  // 1 + 1 (Seed Pellets) - 1 (sowed) = 1
        food: 2,   // Day Laborer
        minorImprovements: ['seed-pellets-a065'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
  })

  test('bonus grain allows sowing 2 fields when starting with 1 grain', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['seed-pellets-a065'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.run()

    // dennis: onSow gives +1 grain (now 2), sow both
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.action(game, 'sow-field', { row: 0, col: 3, cropType: 'grain' })
    // 0 grain + 0 vegetables → sow loop auto-exits

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['seed-pellets-a065'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Stable Manure', () => {
  test('harvest extra goods from fields per unfenced stable', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stable-manure-d072'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
          ],
          stables: [{ row: 0, col: 2 }],  // 1 unfenced stable
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: normal harvest gives 1 grain + 1 veg
    // StableManure: 1 unfenced stable → 1 extra harvest
    // With 2 sown fields available, player picks one (grain field chosen)
    t.choose(game, '2,0 (grain x2)')

    t.testBoard(game, {
      dennis: {
        grain: 3,       // 1 (normal) + 1 (Stable Manure) + 1 (Grain Seeds)
        vegetables: 1,  // 1 (normal)
        food: 8,        // 10 + 2 (DL) - 4 (feed)
        minorImprovements: ['stable-manure-d072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },  // 3 → 2 (normal) → 1 (manure)
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('auto-harvests when only one field available', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stable-manure-d072'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],  // 2 unfenced stables
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: normal harvest gives 1 grain (3→2)
    // StableManure: 2 unfenced stables, 1 field → auto-pick, harvest 1 extra (2→1)
    // Second stable: field still has 1 crop → auto-pick again (1→0)
    // No choose prompt needed since only one field available each time

    t.testBoard(game, {
      dennis: {
        grain: 4,       // 1 (normal) + 2 (Stable Manure x2) + 1 (Grain Seeds)
        food: 8,        // 10 + 2 (DL) - 4 (feed)
        minorImprovements: ['stable-manure-d072'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },  // fully harvested (3 → 0)
          ],
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })
})

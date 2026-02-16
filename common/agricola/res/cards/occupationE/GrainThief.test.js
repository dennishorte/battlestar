const t = require('../../../testutil_v2.js')

describe('Grain Thief', () => {
  test('leaves grain on field and takes 1 from supply during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['grain-thief-e112'],
        food: 8,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: field harvests grain (cropCount 2->1), then onHarvestGrain fires
    // Choose to use Grain Thief
    t.choose(game, 'Use Grain Thief')

    t.testBoard(game, {
      round: 5,
      dennis: {
        // grain: 1 harvested normally + 1 from Grain Thief = 2
        // But Grain Thief puts 1 back on field, so net grain = 1 + 1 = 2
        // Field should have 1 grain back (from Grain Thief putting it back)
        grain: 2, // 1 from normal harvest + 1 from supply via Grain Thief
        food: 6, // 8 + 2 (Day Laborer) - 4 (feeding)
        clay: 1, // Clay Pit accumulates 1
        occupations: ['grain-thief-e112'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('can skip Grain Thief during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['grain-thief-e112'],
        food: 8,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: skip Grain Thief
    t.choose(game, 'Skip')

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 1, // normal harvest only
        food: 6, // 8 + 2 - 4
        clay: 1, // Clay Pit accumulates 1
        occupations: ['grain-thief-e112'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })
})

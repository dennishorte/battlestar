const t = require('../../../testutil_v2.js')

describe('Grain Sieve', () => {
  test('gives 1 extra grain when harvesting 2+ grain', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['grain-sieve-d065'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 1, col: 2, crop: 'grain', cropCount: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest field phase: harvest 1 from each grain field = 2 grain
    // GrainSieve: harvested 2 grain (≥2), so +1 extra grain = 3 total
    // food: 10 + 2(DL) + 1(Fish) - 4(feed) = 9

    t.testBoard(game, {
      dennis: {
        grain: 3,   // 2 harvested + 1 from Grain Sieve
        food: 9,
        minorImprovements: ['grain-sieve-d065'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 1, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('does not fire when harvesting fewer than 2 grain', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['grain-sieve-d065'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest field phase: harvest 1 grain from 1 field
    // GrainSieve: only 1 grain harvested (<2), does NOT fire
    // food: 10 + 2(DL) + 1(Fish) - 4(feed) = 9

    t.testBoard(game, {
      dennis: {
        grain: 1,   // only 1 harvested, no bonus
        food: 9,
        minorImprovements: ['grain-sieve-d065'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },   // cropCount was 1, now 0 → empty
          ],
        },
      },
    })
  })
})

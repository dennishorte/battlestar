const t = require('../../../testutil_v2.js')

describe('Lunchtime Beer', () => {
  test('skips field and breeding phase, gets 1 food', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lunchtime-beer-e058'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
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

    // Harvest starts → Lunchtime Beer fires
    // dennis skips field and breeding, gets 1 food
    t.choose(game, 'Skip field and breeding (get 1 food)')

    t.testBoard(game, {
      dennis: {
        grain: 0,    // field NOT harvested (skipped)
        food: 10,    // 10 + 2 (DL) + 1 (Fishing) + 1 (LB) - 4 (feed 2 workers)
        minorImprovements: ['lunchtime-beer-e058'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },  // not harvested
          ],
        },
      },
    })
  })

  test('normal harvest when not skipping', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lunchtime-beer-e058'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
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

    // Harvest starts → Lunchtime Beer fires
    // dennis chooses normal harvest
    t.choose(game, 'Normal harvest')

    t.testBoard(game, {
      dennis: {
        grain: 1,    // field harvested: +1 grain
        food: 9,     // 10 + 2 (DL) + 1 (Fishing) - 4 (feed 2 workers)
        minorImprovements: ['lunchtime-beer-e058'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },  // harvested
          ],
        },
      },
    })
  })
})

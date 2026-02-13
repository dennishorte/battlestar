const t = require('../../../testutil_v2.js')

describe('Beaver Colony', () => {
  test('gives 1 bonus point when taking reed from action space', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beaver-colony-e033'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    // dennis takes Reed Bank → BeaverColony fires: +1 bonus point
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    t.testBoard(game, {
      dennis: {
        reed: 1,           // from Reed Bank (round 2 accumulated)
        food: 2,           // from Day Laborer
        bonusPoints: 1,    // from Beaver Colony
        minorImprovements: ['beaver-colony-e033'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('does not give bonus point for non-reed action', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beaver-colony-e033'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    // dennis takes Forest (wood, not reed) → no bonus point
    t.choose(game, 'Forest')
    t.choose(game, 'Reed Bank')     // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    t.testBoard(game, {
      dennis: {
        wood: 3,           // from Forest (round 2 accumulated)
        food: 2,           // from Day Laborer
        bonusPoints: 0,    // no bonus from non-reed action
        minorImprovements: ['beaver-colony-e033'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})

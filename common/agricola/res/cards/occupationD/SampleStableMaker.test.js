const t = require('../../../testutil_v2.js')

describe('Sample Stable Maker', () => {
  test('returns stable for resources and minor improvement', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sample-stable-maker-d102', 'test-occupation-1'],
        hand: ['test-minor-1'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Play 4 actions to reach return home phase
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Return home: Sample Stable Maker triggers
    t.choose(game, 'Return stable at 2,0')

    // Minor improvement offer from Sample Stable Maker
    t.choose(game, 'Minor Improvement.Test Minor 1')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 1 from SSM
        grain: 2, // 1 from SSM + 1 from Grain Seeds
        food: 3, // 1 from SSM + 2 from Day Laborer
        occupations: ['sample-stable-maker-d102', 'test-occupation-1'],
        minorImprovements: ['test-minor-1'],
        farmyard: {
          stables: [],
        },
      },
    })
  })

  test('skip returning stable', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sample-stable-maker-d102', 'test-occupation-1'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Return home: choose Skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 2, // Day Laborer only
        grain: 1, // Grain Seeds only
        occupations: ['sample-stable-maker-d102', 'test-occupation-1'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('no offer when player has no stables', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sample-stable-maker-d102', 'test-occupation-1'],
        // no stables
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Return home: no stables -> no prompt, game proceeds to next round

    t.testBoard(game, {
      dennis: {
        food: 2, // Day Laborer only
        grain: 1, // Grain Seeds only
        occupations: ['sample-stable-maker-d102', 'test-occupation-1'],
      },
    })
  })
})

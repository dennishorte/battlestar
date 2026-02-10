const t = require('../../../testutil_v2.js')

describe('Nest Site', () => {
  test('gives food when Reed Bank replenishes while non-empty', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['nest-site-a049'],
        occupations: ['test-occupation-1'], // prereq
      },
    })
    game.run()

    // Round 2: Reed Bank replenishes 0→1 (was empty → no trigger)
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis: +1 grain
    t.choose(game, 'Clay Pit')     // micah

    // Round 3: Reed Bank replenishes 1→2 (was non-empty → NestSite: +1 food)
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis: +1 grain
    t.choose(game, 'Clay Pit')     // micah

    // Round 4 replenish fires before testBoard: Reed Bank 2→3 (non-empty → +1 food)
    t.testBoard(game, {
      dennis: {
        food: 6,   // 2 (DL r2) + 1 (NestSite r3) + 2 (DL r3) + 1 (NestSite r4) = 6
        grain: 2,  // 1 (GS r2) + 1 (GS r3) = 2
        occupations: ['test-occupation-1'],
        minorImprovements: ['nest-site-a049'],
      },
    })
  })

  test('does not give food when Reed Bank was empty', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['nest-site-a049'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    // Round 2: Reed Bank goes 0→1 (was empty → no trigger)
    // dennis takes Reed Bank (drains it back to 0)
    t.choose(game, 'Reed Bank')    // dennis: takes 1 reed
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Clay Pit')     // micah

    // Round 3: Reed Bank goes 0→1 (was empty again → no trigger)
    // dennis takes Reed Bank again (drains to 0)
    t.choose(game, 'Reed Bank')    // dennis: takes 1 reed
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Clay Pit')     // micah

    // Round 4 replenish: Reed Bank 0→1 (was empty → no trigger)
    t.testBoard(game, {
      dennis: {
        food: 4,   // 2 (DL r2) + 2 (DL r3) = 4 (no NestSite bonus)
        reed: 2,   // 1 (Reed Bank r2) + 1 (Reed Bank r3)
        occupations: ['test-occupation-1'],
        minorImprovements: ['nest-site-a049'],
      },
    })
  })
})

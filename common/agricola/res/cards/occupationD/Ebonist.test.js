const t = require('../../../testutil_v2.js')

describe('Ebonist', () => {
  test('converts 1 wood to 1 food + 1 grain during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest
      dennis: {
        occupations: ['ebonist-d155'],
        wood: 2,
        food: 3,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase: 4 actions
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase (no fields), then onHarvest → Ebonist triggers
    t.choose(game, 'Convert 1 wood to 1 food + 1 grain')

    // dennis: wood 2 - 1(Ebonist) = 1
    // grain: 0 + 1(GrainSeeds) + 1(Ebonist) = 2
    // food: 3 + 2(DL) + 1(Ebonist) - 4(feeding) = 2
    t.testBoard(game, {
      dennis: {
        occupations: ['ebonist-d155'],
        wood: 1,
        grain: 2,
        food: 2,
      },
    })
  })

  test('can skip conversion', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      dennis: {
        occupations: ['ebonist-d155'],
        wood: 2,
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    t.choose(game, 'Skip')

    // dennis: food 2 + 2(DL) - 4(feeding) = 0
    t.testBoard(game, {
      dennis: {
        occupations: ['ebonist-d155'],
        wood: 2,
        grain: 1,
        food: 0,
      },
    })
  })

  test('does not trigger without wood', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      dennis: {
        occupations: ['ebonist-d155'],
        wood: 0,
        food: 4,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // No Ebonist prompt (wood = 0)
    // dennis: food 4 + 2(DL) - 4(feeding) = 2
    t.testBoard(game, {
      dennis: {
        occupations: ['ebonist-d155'],
        wood: 0,
        grain: 1,
        food: 2,
      },
    })
  })
})

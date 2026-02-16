const t = require('../../../testutil_v2.js')

describe('Beer Tent Operator', () => {
  test('converts 1 wood + 1 grain to 1 point + 2 food during feeding', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest
      dennis: {
        occupations: ['beer-tent-operator-d133'],
        wood: 1,
        grain: 1,
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase: 4 actions
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase, then feeding phase
    // BeerTentOperator triggers during feeding
    t.choose(game, 'Convert 1 wood + 1 grain to 1 point + 2 food')

    // dennis: food 2 + 2(DL) + 2(conversion) - 4(feeding) = 2
    // grain: 1 + 1(GrainSeeds) - 1(conversion) = 1
    // wood: 1 - 1(conversion) = 0
    t.testBoard(game, {
      dennis: {
        occupations: ['beer-tent-operator-d133'],
        wood: 0,
        grain: 1,
        food: 2,
        bonusPoints: 1,
      },
    })
  })

  test('can skip the conversion', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      dennis: {
        occupations: ['beer-tent-operator-d133'],
        wood: 1,
        grain: 1,
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    t.choose(game, 'Skip')

    // dennis: food 2 + 2(DL) - 4(feeding) = 0
    t.testBoard(game, {
      dennis: {
        occupations: ['beer-tent-operator-d133'],
        wood: 1,
        grain: 2, // 1 + 1(GrainSeeds)
        food: 0,
        bonusPoints: 0,
      },
    })
  })

  test('does not trigger without enough resources', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      dennis: {
        occupations: ['beer-tent-operator-d133'],
        wood: 0,
        grain: 0,
        food: 4,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // No BeerTentOperator prompt (wood = 0)
    // dennis: food 4 + 2(DL) - 4(feeding) = 2
    t.testBoard(game, {
      dennis: {
        occupations: ['beer-tent-operator-d133'],
        wood: 0,
        grain: 1, // from Grain Seeds
        food: 2,
        bonusPoints: 0,
      },
    })
  })
})

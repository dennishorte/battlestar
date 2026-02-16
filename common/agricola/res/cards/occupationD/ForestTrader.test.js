const t = require('../../../testutil_v2.js')

describe('Forest Trader', () => {
  test('buys 1 reed for 1 food after using Forest', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['forest-trader-d125'],
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Forest')  // dennis takes Forest (3 wood)
    // ForestTrader triggers
    t.choose(game, 'Buy 1 reed for 1 food')
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['forest-trader-d125'],
        wood: 3,  // Forest gives 3 at round 1
        reed: 1,  // bought with Forest Trader
        food: 1,  // 2 - 1
        grain: 1, // from Grain Seeds
      },
    })
  })

  test('buys 1 stone for 2 food after using Clay Pit', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['forest-trader-d125'],
        food: 3,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Clay Pit')  // dennis takes Clay Pit (1 clay)
    // ForestTrader triggers
    t.choose(game, 'Buy 1 stone for 2 food')
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Forest')      // micah

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['forest-trader-d125'],
        clay: 1,   // from Clay Pit
        stone: 1,  // bought with Forest Trader
        food: 1,   // 3 - 2
        grain: 1,  // from Grain Seeds
      },
    })
  })

  test('can skip purchase', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['forest-trader-d125'],
        food: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['forest-trader-d125'],
        wood: 3,
        food: 2,   // unchanged
        grain: 1,
      },
    })
  })

  test('does not trigger on non-accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['forest-trader-d125'],
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    // Day Laborer is not a wood/clay accumulation space
    t.choose(game, 'Day Laborer')  // dennis — no ForestTrader prompt

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['forest-trader-d125'],
        food: 7,  // 5 + 2 from Day Laborer
      },
    })
  })
})

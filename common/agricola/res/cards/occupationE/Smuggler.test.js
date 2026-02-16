const t = require('../../../testutil_v2.js')

describe('Smuggler', () => {
  test('exchanges 1 wood for 1 grain during feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['smuggler-e142'],
        food: 4, // just enough for feeding (4 food for 2 people)
        wood: 2,
      },
      micah: { food: 4 },
    })
    game.run()

    // Play round 4
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: feeding phase — Smuggler fires
    t.choose(game, 'Exchange 1 wood for 1 grain')
    t.choose(game, 'Done')

    t.testBoard(game, {
      round: 5,
      dennis: {
        wood: 1,  // 2 - 1 exchanged
        grain: 1, // from Smuggler
        food: 2,  // 4 + 2 (Day Laborer) - 4 (feeding)
        clay: 1,  // from Clay Pit
        occupations: ['smuggler-e142'],
      },
    })
  })

  test('exchanges 1 grain for 1 stone during feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['smuggler-e142'],
        food: 4,
        grain: 2,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Smuggler during feeding
    t.choose(game, 'Exchange 1 grain for 1 stone')
    t.choose(game, 'Done')

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 1, // 2 - 1 exchanged
        stone: 1, // from Smuggler
        food: 2,  // 4 + 2 (Day Laborer) - 4 (feeding)
        clay: 1,  // from Clay Pit
        occupations: ['smuggler-e142'],
      },
    })
  })

  test('can make both exchanges in one feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['smuggler-e142'],
        food: 4,
        wood: 1,
        grain: 1,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Exchange wood for grain, then grain for stone
    t.choose(game, 'Exchange 1 wood for 1 grain')
    // After first exchange: wood=0, grain=2 (1 original + 1 from exchange)
    t.choose(game, 'Exchange 1 grain for 1 stone')

    t.testBoard(game, {
      round: 5,
      dennis: {
        wood: 0,
        grain: 1,  // 1 + 1 (smuggler) - 1 (smuggler) = 1
        stone: 1,
        clay: 1,   // from Clay Pit
        food: 2,   // 4 + 2 (Day Laborer) - 4 (feeding)
        occupations: ['smuggler-e142'],
      },
    })
  })

  test('can skip exchanges', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['smuggler-e142'],
        food: 4,
        wood: 3,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Skip Smuggler
    t.choose(game, 'Done')

    t.testBoard(game, {
      round: 5,
      dennis: {
        wood: 3,
        clay: 1,  // from Clay Pit
        food: 2,  // 4 + 2 (Day Laborer) - 4 (feeding)
        occupations: ['smuggler-e142'],
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Game Provider', () => {
  // Card text: "Immediately before each harvest, you can discard 1/3/4 grain
  // from different fields to receive 1/2/3 wild boars."
  // Uses onBeforeHarvest hook. Card is 4+ players.

  test('discard 1 grain from 1 field for 1 wild boar at harvest', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['game-provider-b165'],
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play through round 4 (harvest). 4 players × 2 workers = 8 actions.
    // Avoid Farmland for AI players.
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Clay Pit')       // scott
    t.choose(game, 'Reed Bank')      // eliya
    t.choose(game, 'Grain Seeds')    // dennis
    t.choose(game, 'Fishing')        // micah
    t.choose(game, 'Lessons A')      // scott
    t.choose(game, 'Grain Utilization')  // eliya

    // Harvest: Game Provider offers exchange before field phase
    t.choose(game, 'Discard 1 grain from 1 field → 1 wild boar')

    // Food: 10 + 2(DayLaborer) - 4(feeding 2 workers) = 8
    // Grain: 1(Grain Seeds) + 1(field harvest: cropCount 2→1) = 2
    // Field: cropCount 3 → 2(Game Provider) → 1(field harvest)
    // Boar placed in pasture
    t.testBoard(game, {
      dennis: {
        occupations: ['game-provider-b165'],
        food: 8,
        grain: 2,
        animals: { boar: 1 },
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], boar: 1 }],
        },
      },
    })
  })

  test('skip exchange when offered', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['game-provider-b165'],
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Lessons A')
    t.choose(game, 'Grain Utilization')

    // Skip exchange
    t.choose(game, 'Skip')

    // Food: 10 + 2(DayLaborer) - 4(feeding) = 8
    // Grain: 1(Grain Seeds) + 1(field harvest: 3→2) = 2
    t.testBoard(game, {
      dennis: {
        occupations: ['game-provider-b165'],
        food: 8,
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],  // 3 - 1(harvest) = 2
        },
      },
    })
  })
})

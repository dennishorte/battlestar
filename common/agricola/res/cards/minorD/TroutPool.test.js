const t = require('../../../testutil_v2.js')

describe('TroutPool', () => {
  test('gives 1 food when fishing has 3+ accumulated', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['trout-pool-d054'],
      },
      micah: { food: 10 },
    })
    // Set fishing high so after round 2 replenish it's >= 3
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['fishing'].accumulated = 5
    })
    game.run()

    // At work phase start, fishing = 5 + 1 replenish = 6 >= 3 → TroutPool gives 1 food
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from TroutPool + 2 from Day Laborer
        minorImprovements: ['trout-pool-d054'],
      },
    })
  })

  test('no food when fishing has less than 3 accumulated', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['trout-pool-d054'],
      },
      micah: { food: 10 },
    })
    // Default: fishing accumulates 1 per round → round 2 = 1 food on space (< 3)
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2, // only 2 from Day Laborer, no TroutPool bonus
        minorImprovements: ['trout-pool-d054'],
      },
    })
  })

  test('gives food at exactly 3 threshold', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['trout-pool-d054'],
      },
      micah: { food: 10 },
    })
    // Set to 2 so after replenish (+1) it's exactly 3
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['fishing'].accumulated = 2
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from TroutPool + 2 from Day Laborer
        minorImprovements: ['trout-pool-d054'],
      },
    })
  })
})

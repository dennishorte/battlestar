const t = require('../../../testutil_v2.js')

describe('Recluse', () => {
  test('gives 1 food at start of each round when no minor improvements', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['recluse-e111'],
      },
    })
    game.run()

    // Round 1 starts, onRoundStart fires -> Recluse gives 1 food
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // End of round 1. Round 2 starts -> Recluse gives 1 more food
    t.testBoard(game, {
      round: 2,
      dennis: {
        food: 4, // 1 (Recluse round 1) + 2 (Day Laborer) + 1 (Recluse round 2)
        clay: 1, // Clay Pit accumulates 1
        occupations: ['recluse-e111'],
      },
    })
  })

  test('gives 1 wood at start of harvest when no minor improvements', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['recluse-e111'],
        food: 8,
        wood: 0,
      },
      micah: { food: 8 },
    })
    game.run()

    // Round 4: Recluse gives 1 food at round start
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest fires: onHarvestStart -> Recluse gives 1 wood
    t.testBoard(game, {
      round: 5,
      dennis: {
        wood: 1, // from Recluse onHarvestStart
        food: 8, // 8 + 1 (Recluse round start) + 2 (Day Laborer) + 1 (Recluse onFeedingPhase) - 4 (feeding)
        clay: 1, // Clay Pit accumulates 1
        occupations: ['recluse-e111'],
      },
    })
  })
})

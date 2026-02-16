const t = require('../../../testutil_v2.js')

describe('Lumber Virtuoso', () => {
  test('discards excess wood and builds stable during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,  // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lumber-virtuoso-d129'],
        wood: 8,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: field phase, then onHarvest fires for LumberVirtuoso
    t.choose(game, 'Build stables (discard excess wood)')
    // buildStable asks for location
    t.action(game, 'build-stable', { row: 2, col: 0 })

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['lumber-virtuoso-d129'],
        wood: 5,   // 8 -> 5 (discard), stable built free by buildStable
        clay: 1,   // from Clay Pit
        food: 8,   // 10 + 2(DL) - 4(feeding)
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('can skip the action', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lumber-virtuoso-d129'],
        wood: 7,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Harvest: onHarvest fires — choose to skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['lumber-virtuoso-d129'],
        wood: 7,   // unchanged
        clay: 1,
        food: 8,   // 10 + 2(DL) - 4(feeding)
      },
    })
  })

  test('does not trigger with less than 5 wood', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lumber-virtuoso-d129'],
        wood: 4,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Harvest: wood < 5, no prompt from LumberVirtuoso

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['lumber-virtuoso-d129'],
        wood: 4,   // unchanged
        clay: 1,
        food: 8,   // 10 + 2(DL) - 4(feeding)
      },
    })
  })
})

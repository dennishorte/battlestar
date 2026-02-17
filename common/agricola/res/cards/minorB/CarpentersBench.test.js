const t = require('../../../testutil_v2.js')

describe("Carpenter's Bench", () => {
  test('offers pasture build after taking wood from Forest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['carpenters-bench-b015'],
        wood: 1,
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // Take wood from Forest
    t.choose(game, 'Forest')
    // Carpenter's Bench offers to build pasture with taken wood
    t.choose(game, 'Build pasture')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    // Fill remaining actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Verify pasture was built
    t.testBoard(game, {
      dennis: {
        wood: 1, // 1 + 3 (Forest) - 3 (4 fences, 1 free) = 1
        food: 20,
        clay: 1, // Clay Pit
        minorImprovements: ['carpenters-bench-b015'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('can skip building a pasture', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['carpenters-bench-b015'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Verify no pastures were built
    t.testBoard(game, {
      dennis: {
        wood: 3, // 0 + 3 (Forest at round 3)
        food: 20,
        clay: 1, // Clay Pit
        minorImprovements: ['carpenters-bench-b015'],
        farmyard: {
          pastures: [],
        },
      },
    })
  })
})

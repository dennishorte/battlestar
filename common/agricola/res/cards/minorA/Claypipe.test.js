const t = require('../../../testutil_v2.js')

describe('Claypipe', () => {
  test('gives 2 food when 7+ building resources gained in a round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['claypipe-a053'],
      },
    })
    game.run()

    // Round 1: Avoid Forest and Clay Pit so they accumulate
    t.choose(game, 'Day Laborer')     // dennis: +2 food
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis: +1 food (accumulated)
    t.choose(game, 'Reed Bank')       // micah

    // Round 2: Forest has 6 wood (3+3), Clay Pit has 2 clay (1+1)
    t.choose(game, 'Forest')          // dennis: +6 wood
    t.choose(game, 'Day Laborer')     // micah
    t.choose(game, 'Clay Pit')        // dennis: +2 clay
    t.choose(game, 'Grain Seeds')     // micah

    // Return home: Claypipe fires — 6 wood + 2 clay = 8 building resources ≥ 7
    t.testBoard(game, {
      dennis: {
        food: 5, // 2 (Day Laborer R1) + 1 (Fishing R1) + 2 (Claypipe R2)
        wood: 6,
        clay: 2,
        minorImprovements: ['claypipe-a053'],
      },
    })
  })

  test('does not trigger with fewer than 7 building resources', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['claypipe-a053'],
      },
    })
    game.run()

    // Round 1: Dennis takes Forest (3 wood) + Clay Pit (1 clay) = 4 building resources
    t.choose(game, 'Forest')          // dennis: +3 wood
    t.choose(game, 'Day Laborer')     // micah
    t.choose(game, 'Clay Pit')        // dennis: +1 clay
    t.choose(game, 'Grain Seeds')     // micah

    // Return home: Claypipe does NOT fire (3 + 1 = 4 < 7)
    t.testBoard(game, {
      dennis: {
        wood: 3,
        clay: 1,
        minorImprovements: ['claypipe-a053'],
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('SteamMachine', () => {
  test('offers bake bread when last action is accumulation space', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['steam-machine-c025'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis 1st: Day Laborer (not accumulating)
    t.choose(game, 'Day Laborer')
    // Micah 1st
    t.choose(game, 'Clay Pit')
    // Dennis 2nd (last): Forest (accumulating!)
    t.choose(game, 'Forest')
    // Micah 2nd
    t.choose(game, 'Reed Bank')

    // Work phase ends → SteamMachine: last action was accumulating → bake bread
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 2, // 3 - 1 baked
        food: 4, // 2 from Day Laborer + 2 from Fireplace 2 baking
        wood: 3, // from Forest
        minorImprovements: ['steam-machine-c025'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('no bake bread when last action is not accumulation space', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['steam-machine-c025'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis 1st: Forest (accumulating)
    t.choose(game, 'Forest')
    // Micah 1st
    t.choose(game, 'Clay Pit')
    // Dennis 2nd (last): Day Laborer (NOT accumulating)
    t.choose(game, 'Day Laborer')
    // Micah 2nd
    t.choose(game, 'Reed Bank')

    // Work phase ends → last action was Day Laborer (not accumulating) → no bake bread

    t.testBoard(game, {
      dennis: {
        grain: 3,
        food: 2, // 2 from Day Laborer
        wood: 3, // from Forest
        minorImprovements: ['steam-machine-c025'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Archway', () => {
  test('use Archway, get 1 food, then take extra action after all placements', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['archway-d051'],
        food: 0,
      },
    })
    game.run()

    // Dennis turn 1: use Archway → gets 1 food, schedules extra action
    t.choose(game, 'Archway')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Forest')
    // Micah turn 2
    t.choose(game, 'Clay Pit')

    // After all placements, dennis gets extra action choice
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['archway-d051'],
        food: 1, // from Archway
        wood: 3, // from Forest
        grain: 1, // from extra action (Grain Seeds)
      },
    })
  })

  test('archway extra action happens after ALL players finish placing', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['archway-d051'],
      },
    })
    game.run()

    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 1: use Archway
    t.choose(game, 'Archway')
    // Micah turn 2
    t.choose(game, 'Forest')
    // Dennis turn 2
    t.choose(game, 'Clay Pit')

    // After all placements, dennis gets extra action (even though micah went last)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['archway-d051'],
        food: 1, // from Archway
        clay: 1, // from Clay Pit
        grain: 1, // from extra action
      },
    })
  })

  test('can skip extra action', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['archway-d051'],
      },
    })
    game.run()

    // Dennis turn 1: use Archway
    t.choose(game, 'Archway')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Forest')
    // Micah turn 2
    t.choose(game, 'Clay Pit')

    // Skip extra action
    t.choose(game, 'Skip extra action')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['archway-d051'],
        food: 1, // from Archway only
        wood: 3, // from Forest
      },
    })
  })
})

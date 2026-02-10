const t = require('../../../testutil_v2.js')

describe('Loppers', () => {
  test('exchanges wood and fence for food and bonus point after building fences', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['loppers-a034'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        wood: 10,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    // Dennis takes Fencing action
    t.choose(game, 'Fencing')

    // Build a 1-space pasture
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 2 }] })
    t.choose(game, 'Done building fences')

    // Loppers fires → offer exchange
    t.choose(game, 'Exchange 1 wood and 1 fence for 2 food and 1 bonus point')

    // Remaining workers
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Clay Pit')        // micah

    t.testBoard(game, {
      dennis: {
        wood: 5, // 10 - 4 (fences) - 1 (Loppers exchange)
        food: 4, // 2 (Loppers) + 2 (Day Laborer)
        bonusPoints: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['loppers-a034'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
    })
  })

  test('can skip the loppers offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['loppers-a034'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        wood: 10,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 2 }] })
    t.choose(game, 'Done building fences')

    t.choose(game, 'Skip')

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 6, // 10 - 4 (fences)
        food: 2, // Day Laborer only
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['loppers-a034'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }] }],
        },
      },
    })
  })
})

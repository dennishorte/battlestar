const t = require('../../../testutil_v2.js')

describe('Manservant', () => {
  // Card text: "Once you live in a stone house, place 3 food on each
  // remaining round space. At the start of these rounds, you get the food."
  // Uses checkTrigger to detect stone house and scheduleResource.
  // Card is 1+ players.

  test('schedules 3 food per remaining round when stone house is built', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['manservant-b107'],
        roomType: 'stone',
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,  // from Day Laborer
        occupations: ['manservant-b107'],
        roomType: 'stone',
        scheduled: {
          food: { 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3, 13: 3, 14: 3 },
        },
      },
    })
  })

  test('does not trigger while in wood house', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['manservant-b107'],
        roomType: 'wood',
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['manservant-b107'],
      },
    })
  })

  test('only triggers once', () => {
    // Start with stone house — trigger fires immediately.
    // Take another action; it shouldn't schedule again.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['manservant-b107'],
        roomType: 'stone',
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds')  // dennis 2nd action

    // Still only 9 rounds of scheduled food (6-14), not doubled
    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1,
        occupations: ['manservant-b107'],
        roomType: 'stone',
        scheduled: {
          food: { 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3, 13: 3, 14: 3 },
        },
      },
    })
  })
})

const t = require('../testutil_v2.js')

describe('_completeOccupationPlay', () => {
  test('free play: card is played, no cost deducted', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-occupation-1'],
        food: 5,
      },
    })
    game.run()

    // Play via Lessons A (first occupation is free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        food: 5,
        occupations: ['test-occupation-1'],
      },
    })
  })

  test('with cost: food is deducted correctly', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-occupation-1', 'test-occupation-2'],
        occupations: ['test-occupation-3'], // already has one, so next costs 1 food
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        food: 4, // 5 - 1 food cost
        hand: ['test-occupation-2'],
        occupations: ['test-occupation-3', 'test-occupation-1'],
      },
    })
  })

  test('custom log template via PaperKnife', () => {
    const util = require('../../lib/util')
    const originalSelect = util.array.select
    util.array.select = (arr) => arr[0]

    try {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Major Improvement'],
        firstPlayer: 'dennis',
        dennis: {
          hand: ['paper-knife-a003', 'test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
          wood: 1,
          food: 10,
        },
        micah: { food: 10 },
      })
      game.run()

      t.choose(game, 'Major Improvement')
      t.choose(game, 'Minor Improvement.Paper Knife')
      // With 3 occupations, all auto-selected. Mock returns first → test-occupation-1

      t.choose(game, 'Day Laborer')  // micah
      t.choose(game, 'Grain Seeds')  // dennis
      t.choose(game, 'Forest')       // micah

      // Verify custom log message
      const logs = game.log.getLog().filter(e => e.template).map(e => e.template)
      expect(logs).toContain('{player} plays {card} for free (Paper Knife)')
    }
    finally {
      util.array.select = originalSelect
    }
  })

  test('onBeforePlayOccupation fires by default (Patron gives 2 food)', () => {
    const util = require('../../lib/util')
    const originalSelect = util.array.select
    util.array.select = (arr) => arr[0]

    try {
      const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationD', 'test'] })
      t.setBoard(game, {
        round: 1,
        firstPlayer: 'dennis',
        dennis: {
          hand: ['moonshine-b003', 'test-occupation-1'],
          occupations: ['patron-d152'], // Patron: onBeforePlayOccupation gives 2 food
          food: 3,
        },
      })
      game.run()

      t.choose(game, 'Meeting Place')
      t.choose(game, 'Minor Improvement.Moonshine')
      t.choose(game, 'Play Test Occupation 1 for 2 food')

      t.choose(game, 'Day Laborer')  // micah
      t.choose(game, 'Forest')       // dennis
      t.choose(game, 'Clay Pit')     // micah

      t.testBoard(game, {
        dennis: {
          // 3 food - 2 (moonshine cost) + 2 (Patron onBeforePlayOccupation) + 1 (Meeting Place) = 4
          food: 4,
          wood: 3,
          occupations: ['patron-d152', 'test-occupation-1'],
          minorImprovements: ['moonshine-b003'],
        },
      })
    }
    finally {
      util.array.select = originalSelect
    }
  })

  test('skipBeforeHooks suppresses onBeforePlayOccupation', () => {
    // playOccupation fires onBeforePlayOccupation itself before cost logic,
    // then passes skipBeforeHooks: true to _completeOccupationPlay.
    // Patron should fire exactly once (from playOccupation's own call).
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-occupation-1'],
        occupations: ['patron-d152'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        // 5 - 1 (occupation cost, 2nd occupation) + 2 (Patron fires once) = 6
        food: 6,
        occupations: ['patron-d152', 'test-occupation-1'],
      },
    })

    // Verify Patron message appears exactly once
    const patronLogs = game.log.getLog().filter(
      e => e.template === '{player} gets 2 food from {card}'
    )
    expect(patronLogs).toHaveLength(1)
  })

  test('onPlayOccupation hooks fire on active cards (Bookcase gives 1 vegetable)', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-occupation-1'],
        occupations: ['test-occupation-2'], // prereq for Bookcase
        minorImprovements: ['bookcase-c068'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        food: 4, // 5 - 1 (occupation cost)
        vegetables: 1, // from Bookcase onPlayOccupation
        occupations: ['test-occupation-2', 'test-occupation-1'],
        minorImprovements: ['bookcase-c068'],
      },
    })
  })

  test("card's onPlay hook fires (Clay Carrier gives 2 clay)", () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clay-carrier-d122'],
        food: 5,
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Carrier')

    t.testBoard(game, {
      dennis: {
        food: 5, // first occupation is free
        clay: 2, // from Clay Carrier onPlay
        occupations: ['clay-carrier-d122'],
      },
    })
  })
})

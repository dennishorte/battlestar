const t = require('../../../testutil_v2.js')

describe('Autumn Mother', () => {
  // Card text: "Immediately before each harvest, if you have room in your
  // house, you can take a 'Family Growth' action for 3 food."

  test('offers family growth before harvest when rooms > family', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['autumn-mother-c092'],
        food: 10,
        farmyard: {
          rooms: [{ row: 0, col: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase: 4 workers
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: onBeforeHarvest fires → Autumn Mother offers family growth
    t.choose(game, 'Pay 3 food for family growth')

    // Feeding is automatic (no anytime actions)

    t.testBoard(game, {
      dennis: {
        occupations: ['autumn-mother-c092'],
        familyMembers: 3,
        food: 4,
        grain: 1,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not trigger when rooms equal family size', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['autumn-mother-c092'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest: rooms (2) = family (2), Autumn Mother does NOT trigger
    // Feeding is automatic

    t.testBoard(game, {
      dennis: {
        occupations: ['autumn-mother-c092'],
        familyMembers: 2,
        food: 8,
        grain: 1,
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Farmyard Manure', () => {
  test('schedules food on next 3 round spaces when building a stable', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['farmyard-manure-a043'],
        wood: 2, // stable cost
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
    })
    game.run()

    // dennis: Farm Expansion → Build Stable
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    // Check scheduledFood immediately (still in round 1, before delivery)
    expect(game.state.scheduledFood.dennis[2]).toBe(1)
    expect(game.state.scheduledFood.dennis[3]).toBe(1)
    expect(game.state.scheduledFood.dennis[4]).toBe(1)

    // Remaining workers
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Clay Pit')     // micah

    // Now in round 2: scheduled food for round 2 was delivered (+1 food)
    t.testBoard(game, {
      dennis: {
        food: 3, // 2 (DL) + 1 (scheduled food for round 3)
        minorImprovements: ['farmyard-manure-a043'],
        animals: { sheep: 1 },
        farmyard: {
          stables: [{ row: 1, col: 1 }],
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
    })
  })

  test('does not schedule food past round 14', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['farmyard-manure-a043'],
        wood: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
      round: 13,
    })
    game.run()

    // Round 13: build stable → schedules food for 14 only (15, 16 past end)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['farmyard-manure-a043'],
        animals: { sheep: 1 },
        scheduled: { food: { 14: 1 } },
        farmyard: {
          stables: [{ row: 1, col: 1 }],
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})

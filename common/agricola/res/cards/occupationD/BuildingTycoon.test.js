const t = require('../../../testutil_v2.js')

describe('Building Tycoon', () => {
  test('builds a room when opponent builds a room', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      micah: {
        wood: 5,
        reed: 2,
      },
      dennis: {
        occupations: ['building-tycoon-d128'],
        food: 1,
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    // micah takes Farm Expansion and builds a room
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1') // micah builds room at 0,1

    // onAnyBuildRoom fires: BuildingTycoon triggers for dennis
    t.choose(game, 'Build a room (pay 1 food to opponent + room cost)')
    t.choose(game, '0,1') // dennis builds room at 0,1

    // micah's Farm Expansion loop: can't afford more → auto Done
    // Continue remaining actions
    t.choose(game, 'Day Laborer')    // dennis: +2 food
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Grain Seeds')    // dennis: +1 grain

    t.testBoard(game, {
      dennis: {
        occupations: ['building-tycoon-d128'],
        food: 2,  // 1 - 1(to micah) + 2(DL)
        wood: 0,  // 5 - 5(room)
        reed: 0,  // 2 - 2(room)
        grain: 1, // Grain Seeds
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
      micah: {
        food: 1,  // 0 + 1(from dennis)
        wood: 3,  // 5 - 5(room) + 3(Forest)
        reed: 0,  // 2 - 2(room)
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('can skip building', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      micah: {
        wood: 5,
        reed: 2,
      },
      dennis: {
        occupations: ['building-tycoon-d128'],
        food: 1,
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    // BuildingTycoon triggers for dennis — skip
    t.choose(game, 'Skip')

    // Continue
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Grain Seeds')    // dennis

    t.testBoard(game, {
      dennis: {
        occupations: ['building-tycoon-d128'],
        food: 3,  // 1 + 2(DL)
        wood: 5,
        reed: 2,
        grain: 1,
      },
      micah: {
        wood: 3,  // 5 - 5(room) + 3(Forest)
        reed: 0,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not trigger when owner builds a room', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['building-tycoon-d128'],
        food: 1,
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    // dennis builds a room — BuildingTycoon should NOT trigger (self-build)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    // No BuildingTycoon prompt for dennis
    // Continue
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Grain Seeds')    // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['building-tycoon-d128'],
        food: 3,  // 1 + 2(DL)
        wood: 0,  // 5 - 5(room)
        reed: 0,  // 2 - 2(room)
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})

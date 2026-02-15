const t = require('../../../testutil_v2.js')

describe('Cattle Feeder', () => {
  // Card text: "Each time you use the 'Grain Seeds' action space, you can
  // also buy 1 cattle for 1 food."
  // Card is 4+ players.

  test('Grain Seeds offers to buy 1 cattle for 1 food', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cattle-feeder-b166'],
        food: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Buy 1 cattle for 1 food')

    t.testBoard(game, {
      dennis: {
        grain: 1,  // from Grain Seeds
        food: 2,   // 3 - 1
        animals: { cattle: 1 },
        occupations: ['cattle-feeder-b166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], cattle: 1 }],
        },
      },
    })
  })

  test('player can skip the cattle offer', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cattle-feeder-b166'],
        food: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 3,  // unchanged
        occupations: ['cattle-feeder-b166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
  })

  test('no offer without food or capacity', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cattle-feeder-b166'],
        food: 0,
        // No pasture for cattle
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    // No cattle offer — no food and no capacity

    t.testBoard(game, {
      dennis: {
        grain: 1,
        occupations: ['cattle-feeder-b166'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cattle-feeder-b166'],
        food: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 5,  // 3 + 2 from Day Laborer
        occupations: ['cattle-feeder-b166'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
  })
})

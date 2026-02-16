const t = require('../../../testutil_v2.js')

describe('Animal Activist', () => {
  test('gives 4 wood when played in round 1 (13 rounds left >= 9)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['animal-activist-d136'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Activist')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 4,
        occupations: ['animal-activist-d136'],
      },
    })
  })

  test('gives 2 wood when played in round 10 (4 rounds left >= 3)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['animal-activist-d136'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Activist')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        food: 20,
        occupations: ['animal-activist-d136'],
      },
    })
  })

  test('gives 0 wood when played in round 12 (2 rounds left < 3)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['animal-activist-d136'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Activist')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        food: 20,
        occupations: ['animal-activist-d136'],
      },
    })
  })

  test('gives 2 bonus points to player with most fenced stables at end of game', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-activist-d136'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }], stables: [{ row: 0, col: 4 }] }],
          stables: [{ row: 0, col: 4 }],
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play through round 14 (last round)
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Grain Seeds')   // micah

    // Score breakdown for dennis:
    // fields: 0 => -1, pastures: 1 => +1, grain: 0 => -1, veg: 0 => -1
    // sheep: 0 => -1, boar: 0 => -1, cattle: 0 => -1
    // rooms: 2 wood => 0, family: 2 * 3 = 6
    // unused: 15 - 2 rooms - 1 pasture space = 12 => -12
    // fencedStables: 1 => +1
    // Animal Activist getEndGamePointsAllPlayers: +2 (dennis has 1 fenced stable > micah's 0)
    // Total: -5 + 0 + 6 - 12 + 1 + 2 = -8
    t.testBoard(game, {
      dennis: {
        score: -8,
        food: 8, // 10 + 2 (DL) - 4 (harvest feeding)
        clay: 1, // from Clay Pit
        bonusPoints: 2,
        occupations: ['animal-activist-d136'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }], stables: [{ row: 0, col: 4 }] }],
          stables: [{ row: 0, col: 4 }],
        },
      },
    })
  })
})

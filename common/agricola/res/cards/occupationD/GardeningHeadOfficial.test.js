const t = require('../../../testutil_v2.js')

describe('Gardening Head Official', () => {
  test('gives 4 wood when played in round 2 (12 rounds left >= 9)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['gardening-head-official-d135'],
      },
    })
    game.run()

    // Round 2 (default): roundsLeft = 14 - 2 = 12 >= 9 => 4 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Gardening Head Official')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 4,
        occupations: ['gardening-head-official-d135'],
      },
    })
  })

  test('gives 3 wood when played in round 6 (8 rounds left >= 6)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['gardening-head-official-d135'],
      },
    })
    game.run()

    // Round 6: roundsLeft = 14 - 6 = 8 >= 6 => 3 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Gardening Head Official')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        occupations: ['gardening-head-official-d135'],
      },
    })
  })

  test('gives 2 wood when played in round 9 (5 rounds left >= 3)', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 9,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['gardening-head-official-d135'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // Round 9: roundsLeft = 14 - 9 = 5 >= 3 => 2 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Gardening Head Official')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        food: 20,
        occupations: ['gardening-head-official-d135'],
      },
    })
  })

  test('gives 2 bonus points to player with most vegetables in fields at end of game', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['gardening-head-official-d135'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'vegetables', cropCount: 2 }],
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
    // fields: 1 => -1, pastures: 0 => -1, grain: 0 => -1, veg: 1 (from harvest) => +1
    // sheep: 0 => -1, boar: 0 => -1, cattle: 0 => -1
    // rooms: 2 wood => 0, family: 2 * 3 = 6
    // unused: 15 - 2 rooms - 1 field = 12 => -12
    // GHO getEndGamePointsAllPlayers: +2 (dennis has 1 veg in field > micah's 0)
    // Total: -5 + 0 + 6 - 12 + 2 = -9
    t.testBoard(game, {
      dennis: {
        score: -9,
        food: 8, // 10 + 2 (DL) - 4 (harvest feeding)
        vegetables: 1, // harvested from field during field phase
        clay: 1, // from Clay Pit
        bonusPoints: 2,
        occupations: ['gardening-head-official-d135'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'vegetables', cropCount: 1 }], // 1 harvested during field phase
        },
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Animal Husbandry Worker', () => {
  test('gives 4 wood when played in round 2 (12 rounds left >= 9), skip fence building', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['animal-husbandry-worker-e136'],
      },
    })
    game.run()

    // Round 2: roundsLeft = 14 - 2 = 12 >= 9 => 4 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Husbandry Worker')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 4,
        occupations: ['animal-husbandry-worker-e136'],
      },
    })
  })

  test('gives 3 wood when played in round 6 (8 rounds left >= 6)', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['animal-husbandry-worker-e136'],
      },
    })
    game.run()

    // Round 6: roundsLeft = 14 - 6 = 8 >= 6 => 3 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Husbandry Worker')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        occupations: ['animal-husbandry-worker-e136'],
      },
    })
  })

  test('scoring: player with most pastures gets 2 VP', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-husbandry-worker-e136'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Play through round 14 (last round) so endGame triggers getEndGamePointsAllPlayers
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Grain Seeds')   // micah

    // Score breakdown for dennis:
    // fields: 0 => -1, pastures: 1 => +1, grain: 0 => -1, veg: 0 => -1
    // sheep: 0 => -1, boar: 0 => -1, cattle: 0 => -1
    // rooms: 2 wood => 0, family: 2 => 6
    // unused: 15 - 2 rooms - 1 pasture space = 12 => -12
    // AHW getEndGamePointsAllPlayers: +2 (dennis has most pastures: 1 > 0)
    // Total: -5 + 0 + 6 - 12 + 2 = -9
    t.testBoard(game, {
      dennis: {
        score: -9,
        food: 8, // 10 + 2 (DL) - 4 (harvest feeding)
        clay: 1, // from Clay Pit
        bonusPoints: 2,
        occupations: ['animal-husbandry-worker-e136'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })
})

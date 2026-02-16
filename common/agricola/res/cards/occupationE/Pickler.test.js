const t = require('../../../testutil_v2.js')

describe('Pickler', () => {
  test('gives 4 wood when played in round 2 (12 rounds left >= 9)', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pickler-e135'],
      },
    })
    game.run()

    // Round 2: roundsLeft = 14 - 2 = 12 >= 9 => 4 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Pickler')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 4,
        occupations: ['pickler-e135'],
      },
    })
  })

  test('gives 3 wood when played in round 6 (8 rounds left >= 6)', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pickler-e135'],
      },
    })
    game.run()

    // Round 6: roundsLeft = 14 - 6 = 8 >= 6 => 3 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Pickler')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        occupations: ['pickler-e135'],
      },
    })
  })

  test('scoring: player with most total vegetables gets 3 VP', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pickler-e135'],
        vegetables: 2,
        food: 10,
      },
      micah: {
        vegetables: 0,
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
    // fields: 0 => -1, pastures: 0 => -1, grain: 0 => -1, veg: 2 => +2
    // sheep: 0 => -1, boar: 0 => -1, cattle: 0 => -1
    // rooms: 2 wood => 0, family: 2 => 6, unused: 13 => -13
    // Pickler getEndGamePointsAllPlayers: +3 (dennis has most vegetables: 2 > 0)
    // Total: -4 + 0 + 6 - 13 + 3 = -8
    t.testBoard(game, {
      dennis: {
        score: -8,
        vegetables: 2,
        food: 8, // 10 + 2 (DL) - 4 (harvest feeding)
        clay: 1, // from Clay Pit
        bonusPoints: 3,
        occupations: ['pickler-e135'],
      },
    })
  })
})

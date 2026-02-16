const t = require('../../../testutil_v2.js')

describe('Visionary', () => {
  test('gives resources when played in round 4 or before', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['visionary-e155'],
        food: 5,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    // Play Visionary in round 2 (≤ 4)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Visionary')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 5,  // first occ is free
        stone: 1,
        vegetables: 1,
        animals: { boar: 2 },
        occupations: ['visionary-e155'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], boar: 2 }],
        },
      },
    })
  })

  test('does not give resources when played after round 4', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['visionary-e155'],
        food: 5,
      },
    })
    game.run()

    // Play Visionary in round 5 (> 4) — no resources
    t.choose(game, 'Lessons A')
    t.choose(game, 'Visionary')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 5,  // first occ free
        stone: 0,
        vegetables: 0,
        occupations: ['visionary-e155'],
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Large-Scale Farmer', () => {
  // Card text: "Each time after you use the 'Farm Expansion' or 'Major
  // Improvement' action space while the other is unoccupied, you can pay
  // 1 food to use that other space with the same person."
  // Card is 3+ players. Farm Expansion = build-room-stable, Major Improvement = major-minor-improvement.

  test('Farm Expansion while Major Improvement unoccupied: pay 1 food for Major Improvement', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['large-scale-farmer-b150'],
        food: 3,
        wood: 10,
        reed: 4,
      },
    })
    game.run()

    // Use Farm Expansion — build a room (5 wood + 2 reed)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')  // adjacent to starting room at (0,0)
    t.choose(game, 'Done Building')

    // Large-Scale Farmer offers Major Improvement
    t.choose(game, 'Use Major Improvement (pay 1 food)')
    // No affordable improvements → auto-skips

    t.testBoard(game, {
      dennis: {
        food: 2,  // 3 - 1
        wood: 5,  // 10 - 5 (room cost)
        reed: 2,  // 4 - 2 (room cost)
        occupations: ['large-scale-farmer-b150'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('no offer when other space is occupied', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['large-scale-farmer-b150'],
        food: 3,
        wood: 10,
        reed: 4,
      },
    })
    game.run()

    // micah takes Major Improvement first (occupies it)
    t.choose(game, 'Major Improvement')
    // No affordable improvements → auto-skips
    // scott's turn
    t.choose(game, 'Day Laborer')

    // dennis takes Farm Expansion
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Done Building')
    // No Large-Scale Farmer offer — Major Improvement is occupied

    t.testBoard(game, {
      dennis: {
        food: 3,
        wood: 5,
        reed: 2,
        occupations: ['large-scale-farmer-b150'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('player can skip the offer', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['large-scale-farmer-b150'],
        food: 3,
        wood: 10,
        reed: 4,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Done Building')

    // Large-Scale Farmer offers Major Improvement — skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3,
        wood: 5,
        reed: 2,
        occupations: ['large-scale-farmer-b150'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})

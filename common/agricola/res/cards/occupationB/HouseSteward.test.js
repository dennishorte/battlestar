const t = require('../../../testutil_v2.js')

describe('House Steward', () => {
  // Card text: "If there are still 1/3/6/9 complete rounds left to play, you
  // immediately get 1/2/3/4 wood. During scoring, each player with the most
  // rooms gets 3 bonus points."
  // Card is 3+ players.

  test('onPlay gives 4 wood when 9+ rounds remain', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['house-steward-b136'],
        wood: 0,
      },
    })
    game.run()

    // Round 2; roundsLeft = 14 - 2 = 12 ≥ 9 → 4 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'House Steward')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        wood: 4,
      },
    })
  })

  test('onPlay gives 3 wood when 6-8 rounds remain', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['house-steward-b136'],
        wood: 0,
      },
    })
    game.run()

    // Round 7; roundsLeft = 14 - 7 = 7 ≥ 6 → 3 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'House Steward')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        wood: 3,
      },
    })
  })

  test('onPlay gives 2 wood when 3-5 rounds remain', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['house-steward-b136'],
        wood: 0,
      },
    })
    game.run()

    // Round 10; roundsLeft = 14 - 10 = 4 ≥ 3 → 2 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'House Steward')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        wood: 2,
      },
    })
  })

  test('onPlay gives 1 wood when 1-2 rounds remain', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 13,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['house-steward-b136'],
        wood: 0,
      },
    })
    game.run()

    // Round 13; roundsLeft = 14 - 13 = 1 ≥ 1 → 1 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'House Steward')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        wood: 1,
      },
    })
  })

  test('onPlay gives 0 wood when 0 rounds remain (round 14)', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['house-steward-b136'],
        wood: 0,
      },
    })
    game.run()

    // Round 14; roundsLeft = 14 - 14 = 0 → 0 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'House Steward')

    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        wood: 0,
      },
    })
  })

  test('scoring gives 3 bonus points to player with most rooms', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['house-steward-b136'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],  // 3 rooms
        },
      },
      micah: {
        // default 2 rooms
      },
    })
    game.run()

    // dennis has 3 rooms (most) → +3 bonus
    // base 3-room score: 6 (family) - 7 (categories) - 12 (empty) = -13, +3 bonus = -10
    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        score: -10,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
      micah: {
        score: -14,  // default 2 rooms, no bonus
      },
    })
  })

  test('scoring gives 3 bonus points to all players tied for most rooms', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['house-steward-b136'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
      micah: {
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Both have 3 rooms (tied for most) → both get +3 bonus
    t.testBoard(game, {
      dennis: {
        occupations: ['house-steward-b136'],
        score: -10,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
      micah: {
        score: -10,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})

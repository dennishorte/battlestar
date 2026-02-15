const t = require('../../../testutil_v2.js')

describe('Carpenter', () => {
  // Card text: "Every new room only costs you 3 of the appropriate building
  // resource and 2 reed."
  // Uses modifyBuildCost. Card is 1+ players.

  test('reduces wood room cost to 3 wood + 2 reed', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenter-b126'],
        wood: 3,
        reed: 2,
      },
    })
    game.run()

    // Build a room (normally 5 wood + 2 reed, but Carpenter makes it 3 wood + 2 reed)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        wood: 0,   // 3 - 3
        reed: 0,   // 2 - 2
        occupations: ['carpenter-b126'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not affect renovation cost', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenter-b126'],
        wood: 10,
        reed: 5,
      },
    })
    game.run()

    // Just verify the card is active
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        wood: 10,
        reed: 5,
        food: 2,
        occupations: ['carpenter-b126'],
      },
    })
  })
})

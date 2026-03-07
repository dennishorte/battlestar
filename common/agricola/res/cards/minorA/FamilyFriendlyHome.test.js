const t = require('../../../testutil_v2.js')

describe('Family Friendly Home', () => {
  test('gives food and family growth when player has more rooms than all other players before action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['family-friendly-home-a021'],
        occupations: ['test-occupation-1'],
        wood: 5, reed: 2, // cost of 1 room
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms total (default 2 + this), other player has 2
        },
      },
    })
    game.run()

    // Dennis takes Farm Expansion, builds a room at (0,1)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Family Friendly Home
        familyMembers: 3, // +1 from family growth
        occupations: ['test-occupation-1'],
        minorImprovements: ['family-friendly-home-a021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not trigger when player has same number of rooms as other players before action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['family-friendly-home-a021'],
        occupations: ['test-occupation-1'],
        wood: 5, reed: 2, // cost of 1 room
        // 2 rooms (default), same as other player's 2 rooms
      },
    })
    game.run()

    // Dennis takes Farm Expansion, builds a room at (0,1)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        food: 0, // no food from Family Friendly Home
        familyMembers: 2, // no family growth
        occupations: ['test-occupation-1'],
        minorImprovements: ['family-friendly-home-a021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})

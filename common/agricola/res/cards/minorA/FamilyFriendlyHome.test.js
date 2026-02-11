const t = require('../../../testutil_v2.js')

describe('Family Friendly Home', () => {
  test('gives food and family growth when rooms > people after building room', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['family-friendly-home-a021'],
        occupations: ['test-occupation-1'],
        wood: 5, reed: 2, // cost of 1 room
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms total (default 2 + this), 2 family members
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
})

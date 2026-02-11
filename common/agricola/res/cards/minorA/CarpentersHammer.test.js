const t = require('../../../testutil_v2.js')

describe("Carpenter's Hammer", () => {
  test('discounts multi-room building (2 wood rooms)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['carpenters-hammer-a014'],
        // 2 wood rooms: normal cost 10 wood + 4 reed
        // Hammer discount: -2 wood -2 reed = 8 wood + 2 reed
        wood: 8,
        reed: 2,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // extra room for adjacency
        },
      },
      actionSpaces: ['Farm Expansion', 'Day Laborer', 'Forest'],
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build 2 Rooms')
    t.choose(game, '0,1') // first room
    t.choose(game, '1,1') // second room

    t.testBoard(game, {
      dennis: {
        wood: 0,
        reed: 0,
        minorImprovements: ['carpenters-hammer-a014'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('without hammer, cannot afford 2 rooms with discounted resources', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        // Without hammer, 2 rooms = 10 wood + 4 reed, but only 8 + 2
        wood: 8,
        reed: 2,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      actionSpaces: ['Farm Expansion', 'Day Laborer', 'Forest'],
    })
    game.run()

    // Dennis can only afford 1 room (5 wood + 2 reed), no "Build 2 Rooms" option
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        wood: 3, // 8 - 5
        reed: 0, // 2 - 2
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})

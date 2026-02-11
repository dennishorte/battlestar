const t = require('../../../testutil_v2.js')

describe("Carpenter's Parlor", () => {
  test('wooden rooms cost 2 wood + 2 reed instead of 5 wood + 2 reed', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['carpenters-parlor-b013'],
        wood: 2, reed: 2, // reduced cost for 1 room
        roomType: 'wood',
      },
    })
    game.run()

    // Dennis takes Farm Expansion, builds a room with reduced cost
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        wood: 0, // 2 - 2 (reduced cost)
        reed: 0, // 2 - 2
        minorImprovements: ['carpenters-parlor-b013'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not affect clay house room cost', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['carpenters-parlor-b013'],
        clay: 5, reed: 2, // normal clay room cost
        roomType: 'clay',
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        clay: 0, // 5 - 5 (normal cost)
        reed: 0, // 2 - 2
        roomType: 'clay',
        minorImprovements: ['carpenters-parlor-b013'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})

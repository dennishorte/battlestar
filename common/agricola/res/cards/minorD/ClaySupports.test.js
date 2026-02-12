const t = require('../../../testutil_v2.js')

describe('Clay Supports', () => {
  test('reduces clay room cost to 2 clay + 1 wood + 1 reed', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['clay-supports-d015'],
        roomType: 'clay',
        clay: 2,
        wood: 1,
        reed: 1,
      },
      actionSpaces: ['Farm Expansion'],
    })
    game.run()

    // Dennis builds 1 clay room with reduced cost (2 clay + 1 wood + 1 reed)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        wood: 0,
        reed: 0,
        roomType: 'clay',
        minorImprovements: ['clay-supports-d015'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
        },
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Rocky Terrain', () => {
  test('buy 1 stone for 1 food when plowing', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rocky-terrain-c080'],
        food: 1,
      },
    })
    game.run()

    // Dennis uses Farmland (plow 1 field) → Rocky Terrain triggers
    t.choose(game, 'Farmland')
    t.choose(game, '2,0')  // choose plow location
    t.choose(game, 'Buy 1 stone for 1 food')

    t.testBoard(game, {
      dennis: {
        food: 0,    // 1 - 1 = 0
        stone: 1,   // from Rocky Terrain
        minorImprovements: ['rocky-terrain-c080'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})

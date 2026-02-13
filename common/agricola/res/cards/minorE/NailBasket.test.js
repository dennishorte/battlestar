const t = require('../../../testutil_v2.js')

describe('Nail Basket', () => {
  test('pay stone after wood action to build fences', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        minorImprovements: ['nail-basket-e015'],
        stone: 1,
        wood: 1,  // 1 + 3 (Forest) = 4, then spend 4 on fences
      },
    })
    game.run()

    // Take Forest action (wood accumulation → 3 wood)
    t.choose(game, 'Forest')
    // onAction fires → Nail Basket offers
    t.choose(game, 'Pay 1 stone to build fences')
    // Build a single-space pasture (costs 4 wood for fences)
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        // stone: 0 (1 - 1 paid)
        // wood: 0 (1 + 3 from Forest - 4 fences)
        minorImprovements: ['nail-basket-e015'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 4 }] }],
        },
      },
    })
  })

  test('skip fence building offer', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        minorImprovements: ['nail-basket-e015'],
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        stone: 1,   // unchanged
        wood: 3,    // 3 from Forest
        minorImprovements: ['nail-basket-e015'],
      },
    })
  })
})

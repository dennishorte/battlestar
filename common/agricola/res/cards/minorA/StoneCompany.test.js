const t = require('../../../testutil_v2.js')

describe('Stone Company', () => {
  test('offers improvement action with stone requirement after quarry', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 3,
        minorImprovements: ['stone-company-a023'],
      },
      actionSpaces: ['Western Quarry'],
    })
    game.run()

    // Dennis takes Western Quarry (1 stone accumulated)
    // StoneCompany triggers buildImprovement with requireStone
    // Only Clay Oven (clay 3, stone 1) is affordable and costs stone
    t.choose(game, 'Western Quarry')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')

    t.testBoard(game, {
      dennis: {
        clay: 0,  // 3 - 3 for Clay Oven
        stone: 0, // 1 from quarry - 1 for Clay Oven
        minorImprovements: ['stone-company-a023'],
        majorImprovements: ['clay-oven'],
      },
    })
  })

  test('can decline the improvement offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 3, // enough to afford Clay Oven
        minorImprovements: ['stone-company-a023'],
      },
      actionSpaces: ['Western Quarry'],
    })
    game.run()

    // Dennis takes Western Quarry but declines improvement
    t.choose(game, 'Western Quarry')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        clay: 3,
        stone: 1, // 1 from quarry, kept
        minorImprovements: ['stone-company-a023'],
      },
    })
  })
})

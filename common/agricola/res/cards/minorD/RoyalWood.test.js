const t = require('../../../testutil_v2.js')

describe('Royal Wood', () => {
  test('gives wood back when building improvement costing wood', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['royal-wood-d074'],
        wood: 2, stone: 2, // for Joinery (cost: 2 wood + 2 stone)
      },
    })
    game.run()

    // Dennis buys Joinery (2 wood + 2 stone) → floor(2/2) = 1 wood back
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Joinery (joinery)')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 2 - 2 + 1 = 1
        stone: 0,
        minorImprovements: ['royal-wood-d074'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('no wood back when improvement costs no wood', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['royal-wood-d074'],
        clay: 2, // for Fireplace (cost: 2 clay)
      },
    })
    game.run()

    // Dennis buys Fireplace (2 clay) → 0 wood paid, no refund
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        wood: 0,
        minorImprovements: ['royal-wood-d074'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('gives wood back when building room on Farm Expansion', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        minorImprovements: ['royal-wood-d074'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    // Dennis builds a wood room (cost: 5 wood + 2 reed) → floor(5/2) = 2 wood back
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,2')

    t.testBoard(game, {
      dennis: {
        wood: 2, // 5 - 5 + floor(5/2) = 2
        reed: 0,
        minorImprovements: ['royal-wood-d074'],
      },
    })
  })

  test('gives wood back when building stable on Farm Expansion', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        minorImprovements: ['royal-wood-d074'],
        wood: 2,
      },
    })
    game.run()

    // Dennis builds a stable (cost: 2 wood) → floor(2/2) = 1 wood back
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.choose(game, '0,2')

    t.testBoard(game, {
      dennis: {
        wood: 1, // 2 - 2 + floor(2/2) = 1
        minorImprovements: ['royal-wood-d074'],
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})

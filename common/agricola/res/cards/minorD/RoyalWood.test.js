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

  test('sums wood across multiple builds on one Farm Expansion', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        minorImprovements: ['royal-wood-d074'],
        wood: 11,
        reed: 2,
      },
    })
    game.run()

    // Dennis builds a room (5 wood) and 3 stables (6 wood) → floor(11/2) = 5 wood back
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,2')
    for (const space of ['1,2', '2,2', '0,3']) {
      t.choose(game, 'Build Stable')
      t.choose(game, space)
    }
    // Loop exits automatically: dennis has 0 wood and can't afford more

    t.testBoard(game, {
      dennis: {
        wood: 5, // 11 - 11 + floor(11/2) = 5
        reed: 0,
        minorImprovements: ['royal-wood-d074'],
        farmyard: {
          stables: [{ row: 1, col: 2 }, { row: 2, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })

  test('no refund for wood spent before the card is played', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion', 'Meeting Place', 'Forest', 'Grain Seeds'],
      dennis: {
        hand: ['royal-wood-d074'],
        wood: 5,
        reed: 2,
        food: 1,
      },
    })
    game.run()

    // Turn 1: Farm Expansion — Royal Wood still in hand, so the 5 wood paid
    // does not qualify.
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,2')

    // micah turn 1
    t.choose(game, 'Forest')

    // Turn 2: Meeting Place → play Royal Wood
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Royal Wood')

    // micah turn 2
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        wood: 0, // 5 - 5, no refund
        food: 1, // 1 + 1 (Meeting Place) - 1 (card cost)
        reed: 0,
        hand: [],
        minorImprovements: ['royal-wood-d074'],
      },
    })
  })

  test('combines wood from a build and an improvement in the same turn', () => {
    const game = t.fixture({ cardSets: ['minorB', 'minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion'],
      dennis: {
        minorImprovements: ['royal-wood-d074', 'toolbox-b027'],
        wood: 7,
        reed: 2,
        stone: 2,
      },
    })
    game.run()

    // Farm Expansion → room (5 wood); Toolbox offers a major mid-build →
    // Joinery (2 wood + 2 stone). End of turn: floor(7/2) = 3 wood back.
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,2')
    t.choose(game, 'Joinery (joinery)')

    t.testBoard(game, {
      dennis: {
        wood: 3, // 7 - 5 - 2 + 3
        reed: 0,
        stone: 0,
        minorImprovements: ['royal-wood-d074', 'toolbox-b027'],
        majorImprovements: ['joinery'],
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

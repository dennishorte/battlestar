const t = require('../../../testutil_v2.js')

describe('Site Manager', () => {
  test('plays Site Manager and buys a major improvement normally', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        clay: 2,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    // onPlay triggers buyImprovement — choose Fireplace (2 clay)
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['fireplace-2'],
        clay: 0,
      },
    })
  })

  test('single resource type: can replace 1 clay with 1 food for Fireplace', () => {
    // Fireplace costs { clay: 2 }
    // With Site Manager: { clay: 2 } or { clay: 1, food: 1 }
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        clay: 2,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Should be offered cost choice: "2 clay" or "1 clay, 1 food"
    t.choose(game, '1 clay, 1 food')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['fireplace-2'],
        clay: 1,
        food: 0,
      },
    })
  })

  test('multiple resource types: can replace 1 of each for Pottery', () => {
    // Pottery costs { clay: 2, stone: 2 }
    // With Site Manager: replace 1 clay, 1 stone, or both
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        clay: 2,
        stone: 2,
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    t.choose(game, 'Major Improvement.Pottery (pottery)')
    // Choose to replace both: 1 clay + 1 stone + 2 food
    t.choose(game, '1 clay, 1 stone, 2 food')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['pottery'],
        clay: 1,
        stone: 1,
        food: 0,
      },
    })
  })

  test('affordable only via food substitution', () => {
    // Fireplace costs { clay: 2 }, player has 1 clay + 1 food
    // Only affordable via substitution: { clay: 1, food: 1 }
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        clay: 1,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Only one affordable option, no choice presented

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['fireplace-2'],
        clay: 0,
        food: 0,
      },
    })
  })

  test('substitution is temporary — subsequent major purchase has no discount', () => {
    // After Site Manager purchase, buying another major should not get food substitution
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['site-manager-d095'],
        clay: 2,
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    // Fireplace costs 2 clay — no food substitution should be offered
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // If substitution was active, would get a cost choice — but it shouldn't be

    t.testBoard(game, {
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['fireplace-2'],
        clay: 0,
        food: 2,  // Food untouched — no substitution available
      },
    })
  })

  test('Well: can replace 1 stone with food', () => {
    // Well costs { wood: 1, stone: 3 }
    // With Site Manager: can replace 1 wood and/or 1 stone
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        wood: 1,
        stone: 3,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    t.choose(game, 'Major Improvement.Well (well)')
    // Choose to replace 1 stone with food
    t.choose(game, '1 wood, 2 stone, 1 food')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['well'],
        wood: 0,
        stone: 1,
        food: 0,
      },
    })
  })

  test('Well: can replace 1 wood with food when no wood available', () => {
    // Well costs { wood: 1, stone: 3 }
    // Player has 0 wood, 3 stone, 1 food — only affordable with wood→food sub
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        wood: 0,
        stone: 3,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    t.choose(game, 'Major Improvement.Well (well)')
    // Only affordable option: { stone: 3, food: 1 } — no choice needed

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['well'],
        wood: 0,
        stone: 0,
        food: 0,
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Wood Expert', () => {
  test('gives 2 wood when played', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-expert-d117'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Wood Expert')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        occupations: ['wood-expert-d117'],
      },
    })
  })

  test('minor improvement with wood cost offers food-for-wood substitution', () => {
    // Bucksaw costs { wood: 1 }
    // With Wood Expert: can pay { wood: 1 } or { food: 1 }
    const game = t.fixture({ cardSets: ['occupationD', 'minorA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        hand: ['bucksaw-a037'],
        wood: 1,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Bucksaw')
    // Should be offered cost choice: "1 wood" or "1 food"
    t.choose(game, '1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        minorImprovements: ['bucksaw-a037'],
        wood: 1,  // Kept wood
        food: 0,  // Paid food instead
      },
    })
  })

  test('minor improvement allows paying standard wood cost', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        hand: ['bucksaw-a037'],
        wood: 1,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Bucksaw')
    // Choose standard payment
    t.choose(game, '1 wood')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        minorImprovements: ['bucksaw-a037'],
        wood: 0,
        food: 1,
      },
    })
  })

  test('can afford minor improvement via food substitution when no wood', () => {
    // Player has no wood but has food — should still be able to buy Bucksaw
    const game = t.fixture({ cardSets: ['occupationD', 'minorA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        hand: ['bucksaw-a037'],
        wood: 0,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Bucksaw')
    // Only one affordable option (1 food), so no choice presented

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        minorImprovements: ['bucksaw-a037'],
        wood: 0,
        food: 0,
      },
    })
  })

  test('substitution limited to 2 wood maximum for 2-wood cost', () => {
    // WheelPlow costs { wood: 2 }, prereqs: 2 occupations
    // With Wood Expert: can pay { wood: 2 }, { wood: 1, food: 1 }, or { food: 2 }
    const game = t.fixture({ cardSets: ['occupationD', 'minorA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117', 'test-occupation-1', 'test-occupation-2'],
        hand: ['wheel-plow-a018'],
        wood: 0,
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Wheel Plow')
    // Only affordable option is { food: 2 }, no choice needed

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117', 'test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['wheel-plow-a018'],
        wood: 0,
        food: 0,
      },
    })
  })

  test('major improvement with wood cost offers food-for-wood substitution', () => {
    // Well costs { wood: 1, stone: 3 }
    // With Wood Expert: can pay { wood: 1, stone: 3 } or { food: 1, stone: 3 }
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        wood: 1,
        stone: 3,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Well (well)')
    // Should be offered cost choice
    t.choose(game, '3 stone, 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        majorImprovements: ['well'],
        wood: 1,  // Kept wood
        stone: 0,
        food: 0,  // Paid food instead of wood
      },
    })
  })

  test('major improvement with 2 wood cost generates up to 2 substitution options', () => {
    // Joinery costs { wood: 2, stone: 2 }
    // With Wood Expert: { wood: 2, stone: 2 }, { wood: 1, food: 1, stone: 2 }, { food: 2, stone: 2 }
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        wood: 0,
        stone: 2,
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    // Only affordable option is { food: 2, stone: 2 }, no choice needed

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        majorImprovements: ['joinery'],
        wood: 0,
        stone: 0,
        food: 0,
      },
    })
  })

  test('major improvement without wood cost is unaffected', () => {
    // Fireplace costs { clay: 2 }, no wood
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        clay: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        majorImprovements: ['fireplace-2'],
        clay: 0,
      },
    })
  })

  test('substitution limited to actual wood in cost (1 wood cost = max 1 sub)', () => {
    // Well costs { wood: 1, stone: 3 }
    // With Wood Expert max 2, but cost only has 1 wood → only 1 substitution
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['wood-expert-d117'],
        wood: 0,
        stone: 3,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Well (well)')
    // Only option: { food: 1, stone: 3 } — no choice needed since only 1 affordable

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-expert-d117'],
        majorImprovements: ['well'],
        wood: 0,
        stone: 0,
        food: 0,
      },
    })
  })
})

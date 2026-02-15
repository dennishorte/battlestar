const t = require('../../../testutil_v2.js')

describe("Carpenter's Yard", () => {
  test('buy Joinery on Major Improvement → offered Well → buys both', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['carpenters-yard-d026'],
        // Joinery: 2 wood + 2 stone, Well: 1 wood + 3 stone → total: 3 wood + 5 stone
        wood: 3, stone: 5,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    // Carpenter's Yard offers to also build Well
    t.choose(game, 'Also build Well')

    t.testBoard(game, {
      dennis: {
        wood: 0,  // 3 - 2 - 1
        stone: 0, // 5 - 2 - 3
        minorImprovements: ['carpenters-yard-d026'],
        majorImprovements: ['joinery', 'well'],
      },
    })
  })

  test('buy Fireplace on Major Improvement → no second-major offer', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['carpenters-yard-d026'],
        clay: 2, // Fireplace cost
        wood: 1, stone: 3, // Would afford Well
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // No second-major offer because Fireplace not in the list

    t.testBoard(game, {
      dennis: {
        clay: 0,
        wood: 1, stone: 3, // Untouched
        minorImprovements: ['carpenters-yard-d026'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('can decline second major', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['carpenters-yard-d026'],
        wood: 3, stone: 5,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 1,  // 3 - 2
        stone: 3, // 5 - 2
        minorImprovements: ['carpenters-yard-d026'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('does NOT trigger on House Redevelopment', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['carpenters-yard-d026'],
        clay: 2, reed: 1, // Renovation cost: wood→clay
        wood: 3, stone: 5, // Enough for both Joinery + Well
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // After renovation, buy Joinery
    t.choose(game, 'Major Improvement.Joinery (joinery)')
    // No second-major offer because it's House Redevelopment, not Major Improvement

    t.testBoard(game, {
      dennis: {
        clay: 0, reed: 0,
        wood: 1,  // 3 - 2
        stone: 3, // 5 - 2
        roomType: 'clay',
        minorImprovements: ['carpenters-yard-d026'],
        majorImprovements: ['joinery'],
      },
    })
  })
})

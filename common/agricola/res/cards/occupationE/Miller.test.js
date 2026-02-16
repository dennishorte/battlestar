const t = require('../../../testutil_v2.js')

describe('Miller', () => {
  test('onPlay offers to build a baking improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['miller-e095'],
        clay: 3, reed: 1, // enough for Fireplace (2 clay)
      },
    })
    game.run()

    // Play Miller via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Miller')
    // Miller onPlay: offers baking improvements
    t.choose(game, 'Fireplace (fireplace-2)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1, // 3 - 2 (Fireplace cost)
        reed: 1,
        occupations: ['miller-e095'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('onPlay can skip building a baking improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['miller-e095'],
        clay: 3, reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Miller')
    // Skip building
    t.choose(game, 'Do not buy')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 3,
        reed: 1,
        occupations: ['miller-e095'],
      },
    })
  })

  test('onAnyAction triggers bake bread when another player takes Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['miller-e095'],
        majorImprovements: ['fireplace-2'], // baking ability
        grain: 2,
      },
    })
    game.run()

    // Micah takes Grain Seeds -> triggers Miller for dennis
    t.choose(game, 'Grain Seeds')
    // Miller fires for dennis: bake bread
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        grain: 1, // 2 - 1 baked
        food: 2,  // from baking (fireplace rate)
        occupations: ['miller-e095'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('onAnyAction does not trigger when Miller owner takes Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['miller-e095'],
        majorImprovements: ['fireplace-2'],
        grain: 1,
      },
    })
    game.run()

    // Dennis takes Grain Seeds himself -> Miller does NOT trigger (only for other players)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 2, // 1 + 1 from Grain Seeds
        food: 0,
        occupations: ['miller-e095'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('onAnyAction does not trigger without baking ability', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['miller-e095'],
        // No baking improvement
        grain: 1,
      },
    })
    game.run()

    // Micah takes Grain Seeds -> Miller would fire, but no baking ability
    t.choose(game, 'Grain Seeds')
    // No bake prompt -> goes to dennis turn

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        grain: 1, // unchanged
        food: 0,
        occupations: ['miller-e095'],
      },
    })
  })
})

const t = require('../../../testutil_v2.js')

describe('Emergency Seller', () => {
  test('converts wood to 2 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['emergency-seller-e106'],
        wood: 2,
      },
    })
    game.run()

    // Play Emergency Seller via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Emergency Seller')
    // 2 family members = 2 conversions max
    t.choose(game, 'Sell 1 wood (2 food)')
    t.choose(game, 'Sell 1 wood (2 food)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        food: 4, // 2 wood * 2 food each
        occupations: ['emergency-seller-e106'],
      },
    })
  })

  test('converts reed to 3 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['emergency-seller-e106'],
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Emergency Seller')
    // 2 conversions max, sell 1 reed, then no more resources — loop exits
    t.choose(game, 'Sell 1 reed (3 food)')
    // No more building resources, loop exits automatically

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 0,
        food: 3,
        occupations: ['emergency-seller-e106'],
      },
    })
  })

  test('converts stone to 3 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['emergency-seller-e106'],
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Emergency Seller')
    // Sell 1 stone, then no more resources — loop exits
    t.choose(game, 'Sell 1 stone (3 food)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        stone: 0,
        food: 3,
        occupations: ['emergency-seller-e106'],
      },
    })
  })

  test('can mix wood and stone conversions', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['emergency-seller-e106'],
        wood: 1,
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Emergency Seller')
    // 2 family members = 2 conversions
    t.choose(game, 'Sell 1 wood (2 food)')
    t.choose(game, 'Sell 1 stone (3 food)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        stone: 0,
        food: 5, // 2 + 3
        occupations: ['emergency-seller-e106'],
      },
    })
  })

  test('can choose Done to stop early', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['emergency-seller-e106'],
        wood: 3,
        clay: 3,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Emergency Seller')
    // Only sell 1 wood, then stop
    t.choose(game, 'Sell 1 wood (2 food)')
    t.choose(game, 'Done')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        clay: 3,
        food: 2,
        occupations: ['emergency-seller-e106'],
      },
    })
  })

  test('does nothing with no building resources', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['emergency-seller-e106'],
        // no building resources
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Emergency Seller')
    // No resources to sell — loop exits immediately

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 0,
        occupations: ['emergency-seller-e106'],
      },
    })
  })
})

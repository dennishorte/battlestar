const t = require('../../../testutil_v2.js')

describe('Forest Inn', () => {
  test('owner exchanges 5 wood for 8 wood and 2 food (no fee)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-inn-b042'],
        wood: 5,
      },
    })
    game.run()

    // Dennis uses Forest Inn (owner — no fee)
    t.choose(game, 'Forest Inn')
    t.choose(game, 'Exchange 5 wood for 8 wood and 2 food')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 11, // 5 - 5 + 8 + 3 (Forest)
        food: 2,
        minorImprovements: ['forest-inn-b042'],
      },
    })
  })

  test('non-owner pays 1 food to owner then exchanges', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['forest-inn-b042'],
      },
      micah: {
        wood: 7,
        food: 2,
      },
    })
    game.run()

    // Micah uses Forest Inn (non-owner — pays 1 food to Dennis)
    t.choose(game, 'Forest Inn')
    t.choose(game, 'Exchange 7 wood for 8 wood and 4 food')
    // Dennis
    t.choose(game, 'Day Laborer')
    // Micah
    t.choose(game, 'Forest')
    // Dennis
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 (fee) + 2 (Day Laborer)
        clay: 1,
        minorImprovements: ['forest-inn-b042'],
      },
      micah: {
        wood: 11, // 7 - 7 + 8 + 3 (Forest)
        food: 5, // 2 - 1 (fee) + 4 (exchange)
      },
    })
  })

  test('owner can choose higher tier when affordable', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-inn-b042'],
        wood: 9,
      },
    })
    game.run()

    // Dennis uses Forest Inn — chooses the 9 wood tier
    t.choose(game, 'Forest Inn')
    t.choose(game, 'Exchange 9 wood for 8 wood and 7 food')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 11, // 9 - 9 + 8 + 3 (Forest)
        food: 7,
        minorImprovements: ['forest-inn-b042'],
      },
    })
  })

  test('no exchange offered when not enough wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-inn-b042'],
        wood: 3,
      },
    })
    game.run()

    // Dennis uses Forest Inn but has only 3 wood — no exchange offered
    t.choose(game, 'Forest Inn')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 6, // 3 + 3 (Forest)
        minorImprovements: ['forest-inn-b042'],
      },
    })
  })
})
